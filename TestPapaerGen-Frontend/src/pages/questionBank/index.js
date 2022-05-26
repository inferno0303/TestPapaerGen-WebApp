import React from 'react';
import { connect, history } from 'umi';
import moment from 'moment';
import { Badge, Button, Input, PageHeader, Popconfirm, Select, Table, Tag } from 'antd';
import Highlighter from 'react-highlight-words';
import { FileAddOutlined, SearchOutlined, PieChartOutlined } from '@ant-design/icons';
import style from './index.less';
import { delay } from '../../utils/myUtils';
import RenderDrawer from './renderDrawer';
import OverViewModal from './overViewModal';


const renderTopicType = text => {
  switch (text) {
    case '填空题':
      return <Tag color='blue'>{text}</Tag>;
    case '选择题':
      return <Tag color='volcano'>{text}</Tag>;
    case '判断题':
      return <Tag color='purple'>{text}</Tag>;
    case '程序设计题':
      return <Tag color='green'>{text}</Tag>;
    case '程序阅读题':
      return <Tag color='cyan'>{text}</Tag>;
  }
};


class QuestionBank extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columnTitle: ['#', '题目', '题目类型', '分值', '答案', '大知识点', '小知识点', '大章节', '小章节', '操作', '难度', '更新时间'],
      visibleColumn: ['#', '题目', '题目类型', '分值', '答案', '大知识点', '小知识点', '大章节', '小章节', '操作', '难度', '更新时间'],
      defaultColumns: [
        {
          title: '#',
          dataIndex: 'key',
          key: 'key',
          className: style.column_small_text,
          width: 55
        },
        {
          title: '题目',
          dataIndex: 'topic',
          key: 'topic',
          width: 400,
          ...this.getColumnSearchProps('topic'),
          className: style.column_small_text,
        },
        {
          title: '题目类型',
          dataIndex: 'topic_type',
          key: 'topic_type',
          className: style.column_small_text,
          width: 100,
          render: (text) => renderTopicType(text),
          filters: [
            {
              text: '填空题',
              value: '填空题',
            },
            {
              text: '选择题',
              value: '选择题',
            },
            {
              text: '判断题',
              value: '判断题',
            },
            {
              text: '程序设计题',
              value: '程序设计题',
            },
            {
              text: '程序阅读题',
              value: '程序阅读题',
            },
          ],
          filterMultiple: true,
          onFilter: (value, record) => record?.topic_type?.indexOf(value) === 0,
        },
        {
          title: '分值',
          dataIndex: 'score',
          key: 'score',
          className: style.column_small_text,
          width: 85,
          render: (text) => <Tag>{text}分</Tag>,
          sorter: (a, b) => a.score - b.score,
          sortDirections: ['descend', 'ascend'],
        },
        {
          title: '答案',
          dataIndex: 'answer',
          key: 'answer',
          width: 180,
          className: style.column_small_text,
          ...this.getColumnSearchProps('answer'),
        },
        {
          title: '大知识点',
          dataIndex: 'label_1',
          key: 'label_1',
          width: 130,
          className: style.column_small_text,
          render: (text) => <Tag>{text}</Tag>
        },
        {
          title: '小知识点',
          dataIndex: 'label_2',
          key: 'label_2',
          width: 130,
          className: style.column_small_text,
          render: (text) => <Tag>{text}</Tag>,
        },
        {
          title: '大章节',
          dataIndex: 'chapter_1',
          key: 'chapter_1',
          className: style.column_small_text,
          width: 80,
        },
        {
          title: '小章节',
          dataIndex: 'chapter_2',
          key: 'chapter_2',
          className: style.column_small_text,
          width: 80,
        },
        {
          title: '操作',
          key: 'action',
          width: 230,
          className: style.column_small_text,
          render: (record) => (
            <div>
              {
                this.isInclude(record) ?
                  <Button type='link' onClick={this.handleRemoveTestPaperGenList.bind(this, record)}>移出</Button> :
                  <Button type='link' onClick={this.handleAddTestPaperGenList.bind(this, record)}>选择!</Button>
              }
              <Button type='link' onClick={this.handleEditTopic.bind(this, record)} disabled={this.isInclude(record)}>编辑</Button>
              <Popconfirm title={`你确定要删除该条题目吗？`}
                          onConfirm={this.handleDeleteTopic.bind(this, record)}
                          okText="确定"
                          okButtonProps={{ danger: true }}
                          cancelText="取消"
                          placement="rightBottom"
                          disabled={this.isInclude(record)}
              >
                <Button type='link' disabled={this.isInclude(record)} danger>删除</Button>
              </Popconfirm>
            </div>
          ),
        },
        {
          title: '难度',
          dataIndex: 'difficulty',
          key: 'difficulty',
          className: style.column_small_text,
          width: 80,
          sorter: (a, b) => a.difficulty - b.difficulty,
          sortDirections: ['descend', 'ascend'],
        },
        {
          title: '更新时间',
          dataIndex: 'update_time',
          key: 'update_time',
          className: style.column_small_text,
          width: 180,
          render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
          sorter: (a, b) => a.update_time - b.update_time,
          sortDirections: ['descend', 'ascend'],
        },
      ],
      columns: [],
      isLoading: false,
      isDrawerVisible: false,
      modalVisible: false
    };
  }

  // handler
  showDrawer = () => {
    this.setState({
      isDrawerVisible: true,
    });
  };
  hideDrawer = () => {
    this.setState({
      isDrawerVisible: false,
    });
  };

  showModal = () => {
    this.setState({modalVisible: true})
  };
  hideModal = () => {
    this.setState({modalVisible: false})
  };

  handleAddTestPaperGenList = async record => {
    await this.props.dispatch({ type: 'questionGenerator/addTestPaperGenList', payload: record });
  };
  handleRemoveTestPaperGenList = async record => {
    await this.props.dispatch({ type: 'questionGenerator/removeTestPaperGenList', payload: record });
  };
  handleEditTopic = async record => {
    history.push(`/questionEdit?questionBankId=${record.id}`);
  };
  handleDeleteTopic = async record => {
    await this.setState({ isLoading: true });
    await this.props.dispatch({ type: 'questionBank/deleteSingleQuestionBank', payload: { id: record.id } });
    await this.props.dispatch({ type: 'questionBank/getQuestionBank' });
    await this.setState({ isLoading: false });
  };

  // table 的列隐藏
  handleColumnVisible = value => {
    let newColumn = [];
    this.state.defaultColumns.forEach(item => {
      if (value.includes(item.title)) {
        newColumn.push(item);
      }
    });
    this.setState({ columns: newColumn });
  };

  // calc
  // 判断record是否在this.props.testPaperGenList中
  isInclude = record => {
    console.log(record)
    for (let i = 0; i < this.props.testPaperGenList.length; i++) {
      const item = this.props.testPaperGenList[i]
      if (item.id === record.id) return true
    }
    // return this.props.testPaperGenList.includes(record);
  };

  // table 的 search filter功能
  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`搜索 ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined/>}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          确定
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          清空键入
        </Button>
      </div>
    ),
    // 配置表格上filter按钮的样式
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }}/>,
    // 配置搜索规则，value传入
    onFilter: (value, record) =>
      record[dataIndex]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()),

    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },

    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });
  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };
  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  // table 的行样式随着选中状态变化
  rowClassName = (record) => {
    if (this.isInclude(record)) {
      return style.tableRow_selected;
    } else {
      return style.tableRow;
    }
  };
  // table 的点击事件
  onRowClick = record => {
    if (this.props.testPaperGenList.includes(record)) {
      this.handleRemoveTestPaperGenList(record);
    } else {
      this.handleAddTestPaperGenList(record);
    }
  };

  initData = async () => {
    await this.setState({ isLoading: true });
    await this.setState({ columns: this.state.defaultColumns });
    await this.props.dispatch({ type: 'questionBank/getQuestionBank' });
    await delay(200);
    await this.setState({ isLoading: false });
  };

  componentDidMount() {
    this.initData().then(null);
  }

  render() {

    const renderTable = () => {
      return <div className={style.table_wrapper}>
        <Table columns={this.state.columns}
               dataSource={this.props.tableDataSource}
               loading={this.state.isLoading}
               scroll={{ x: 'max-content' }}
               rowClassName={this.rowClassName}
               // bordered
        />
        <span style={{color: "#666", fontSize: "0.8em"}}>控制表格显示的字段</span>
        <Select
          mode="multiple"
          style={{ width: '80%', margin: "20px auto 80px auto" }}
          placeholder="Please select"
          defaultValue={this.state.columnTitle}
          onChange={this.handleColumnVisible}
        >
          {
            this.state.columnTitle.map((item, index) => <Select.Option key={index} value={item}>{item}</Select.Option>)
          }
        </Select>
      </div>;
    };

    return <div>
      {/*标题栏*/}
      <PageHeader title={"题库管理（当前共" + this.props.tableDataSource.length + '题）'}
                  subTitle={'查看所有试题库，支持增删改查'}
                  extra={[
                    <span key="leftTop0">
                      <Button onClick={this.showModal} icon={<PieChartOutlined />} type="primary">概览功能</Button>
                    </span>,
                    <span style={{ margin: '0 15px' }} key="leftTop1">
                      <Badge count={this.props.testPaperGenList.length}>
                        <Button onClick={this.showDrawer} icon={<FileAddOutlined/>} type="primary" id='leftTop1'>已手动选择的题目</Button>
                      </Badge>
                    </span>,
                    <span key="leftTop2">
                      <Button onClick={() => {
                        history.push('/questionEdit');
                      }} icon={<FileAddOutlined />} type="primary">添加题目</Button>
                    </span>,
                  ]}
      />
      {/*已手动选择的题目*/}
      <RenderDrawer show={this.state.isDrawerVisible} hide={this.hideDrawer} />
      {/*概览界面*/}
      <OverViewModal visible={this.state.modalVisible} hide={this.hideModal} dataSource={this.props.tableDataSource} eachChapterCount={this.props.eachChapterCount} />
      {/*题库表格*/}
      {
        renderTable()
      }
    </div>;
  }
}

function mapStateToProps({ questionBank, questionGenerator }) {
  const { tableDataSource, eachChapterCount } = questionBank;
  const { testPaperGenList } = questionGenerator;
  return { tableDataSource, eachChapterCount, testPaperGenList };
}

export default connect(mapStateToProps)(QuestionBank);
