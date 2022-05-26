import React from 'react';
import { Button, Dropdown, Menu, Popconfirm, Popover, Table } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import moment from 'moment';
import style from '../questionBank/index.less';
import ModifyTestPaper from "./modifyTestPaper";
import {delay} from "../../utils/myUtils";

export default class MainTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '#',
        dataIndex: 'key',
        key: 'key',
        width: 55,
        render: text => <span>{text + 1}</span>
      },
      {
        title: '试卷名称',
        dataIndex: 'test_paper_name',
        key: 'test_paper_name',
        width: 220,
      },
      {
        title: '出题人',
        dataIndex: 'username',
        key: 'username',
        width: 180,
      },
      {
        title: '题目数量',
        dataIndex: 'question_count',
        key: 'question_count',
        width: 100,
      },
      {
        title: '平均难度',
        dataIndex: 'average_difficulty',
        key: 'average_difficulty',

        sorter: (a, b) => a.average_difficulty - b.average_difficulty,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: '出题时间',
        dataIndex: 'update_time',
        key: 'update_time',
        width: 200,
        render: text => moment(text).format('YYYY-MM-DD HH:mm:ss'),
        sorter: (a, b) => a.update_time - b.update_time,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: '操作',
        key: 'action',
        width: 250,
        className: style.column_small_text,
        render: (record) => <div>
          <Button type='link' onClick={this.getReport.bind(this, record)}>查看详情</Button>
          <Dropdown overlay={<Menu onClick={this.reExport.bind(this, record)}>
            <Menu.Item key="1"><Button type="link">试卷(*.docx)</Button></Menu.Item>
            <Menu.Item key="2"><Button type="link">答案(*.docx)</Button></Menu.Item>
            </Menu>} placement="bottom" arrow>
            <Button type="link" onClick={this.reExport.bind(this, record)}>重新导出</Button>
          </Dropdown>
          <Button type='link' onClick={this.changeModifyTestPaperVisible.bind(this, record)}>修改组卷</Button>
          {
            this.props.username === record.username ?
              <Popconfirm title={`你确定要删除该历史记录吗？`}
                          onConfirm={this.deleteRecord.bind(this, record)}
                          okText="确定"
                          okButtonProps={{ danger: true }}
                          cancelText="取消"
                          placement="rightBottom"
              >
                <Button type='link' danger>删除记录</Button>
              </Popconfirm> :
              null
          }

        </div>
      },
    ];
    this.state = {
      loading: false,
      tableWidth: 'max-content',
      // 重新组卷
      modifyTestPaperVisible: false,
      // 重新组卷当前选中的试卷uid
      record: null,
    }
  }

  // handler
  getReport = record => {
    this.props.dispatch({type: 'questionGenHistory/reportDifficulty', payload: record.average_difficulty});
    this.props.showReportDrawer(record.test_paper_uid)
  };

  deleteRecord = async record => {
    await this.setState({dataLoading: true});
    await this.props.dispatch({
      type: 'questionGenHistory/deleteQuestionGenHistoryByTestPaperUid',
      payload: {test_paper_uid: record.test_paper_uid}
    });
    await this.setState({dataLoading: false});
  };

  reExport = async (record, e) => {
    console.log(record, e)
    // 导出试卷
    if (e.key === "1") {
      console.log(record.test_paper_uid);
      await this.props.dispatch({
        type: 'questionGenHistory/reExportTestPaper',
        payload: {test_paper_uid: record.test_paper_uid}
      });
    }
    // 导出答案
    if (e.key === "2") {
      await this.props.dispatch({
        type: 'questionGenHistory/exportAnswer',
        payload: {test_paper_uid: record.test_paper_uid}
      });
    }
  }

  // <状态> 修改组卷 对话框 visible
  changeModifyTestPaperVisible = async (record) => {
    // ES2020 optional chaining
    const test_paper_uid = record?.test_paper_uid?? null
    if (test_paper_uid !== null) {
      await this.setState({record: record})
    }
    await this.setState({modifyTestPaperVisible: !this.state.modifyTestPaperVisible})
    await this.props.dispatch({type:'questionGenHistory/getAllTestPaperGenHistory'});
  }

  // 重新导出的下拉菜单
  menu = (
    <Menu onClick={this.reExport}>
      <Menu.Item key="1"><Button type="link">试卷(*.docx)</Button></Menu.Item>
      <Menu.Item key="2"><Button type="link">答案(*.docx)</Button></Menu.Item>
    </Menu>
  );

  initData = async () => {
    await this.setState({loading: true})
    await this.props.dispatch({type:'questionGenHistory/getAllTestPaperGenHistory'});
    await delay(800);
    await this.setState({loading: false})
  };

  componentDidMount() {
    this.initData().then(() => null)
  }

  render() {
    const renderTable = () => {
      return (
          <Table columns={this.columns}
                 dataSource={this.props.dataSource}
                 scroll={{x: this.state.tableWidth}}
                 loading={this.state.loading ? {size: "large", indicator: <LoadingOutlined/>} : false}
                 bordered
                 style={{margin: "0 30px"}}
          />
      )
    };
    return (
      <div>
        {renderTable()}
        <ModifyTestPaper visible={this.state.modifyTestPaperVisible}
                         changeVisible={this.changeModifyTestPaperVisible}
                         record={this.state.record}
                         { ...this.props }
        />
      </div>
    );
  }

}
