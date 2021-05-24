import React from 'react';
import { Button, Input, Popconfirm, Table } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import style from '../questionBank/index.less';

export default class AdminTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '#',
        dataIndex: 'key',
        key: 'key',
        width: 55,
        render: text => <span>{text + 1}</span>,
      },
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
        ...this.getColumnSearchProps('username'),
        width: 220,
      },
      {
        title: '密码',
        dataIndex: 'password',
        key: 'password',
        width: 180
      },
      {
        title: '用户角色',
        dataIndex: 'user_role',
        key: 'user_role',
        width: 180
      },
      {
        title: '申请时间',
        dataIndex: 'last_login',
        key: 'last_login',
        width: 300,
        render: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title: '操作',
        key: 'action',
        width: 250,
        className: style.column_small_text,
        render: (record) => <div>
          <Popconfirm title={`确定要通过该账户申请吗？`}
                      onConfirm={this.onPass.bind(this, record)}
                      okText="确定"
                      okButtonProps={{ danger: true }}
                      cancelText="取消"
                      placement="rightBottom"
          >
            <Button type='link'>通过申请</Button>
          </Popconfirm>
          <Popconfirm title={`确定要删除该账户申请吗？`}
                      onConfirm={this.onDelete.bind(this, record)}
                      okText="确定"
                      okButtonProps={{ danger: true }}
                      cancelText="取消"
                      placement="rightBottom"
          >
            <Button type='link'>删除申请</Button>
          </Popconfirm>
        </div>
      },
    ];
    this.state = {
      dataLoading: false,
      tableWidth: 'max-content',
    };
  }

  // handler
  onPass = record => {
    this.props.dispatch({ type: 'loginModel/passApply', payload: {username: record.username} });
  };
  onDelete = record => {
    this.props.dispatch({ type: 'loginModel/deleteApply', payload: {username: record.username} });
  };


  // table function
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
        .toString()
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

  initData = async () => {
    await this.setState({ dataLoading: true });
    await this.props.dispatch({ type: 'loginModel/getApplyUser' });
    await this.setState({ dataLoading: false });
  };

  componentWillMount() {
    this.initData().then(() => null);
  }

  // render
  renderTable = () => {
    return (
      <div>
        <Table columns={this.columns}
               dataSource={this.props.dataSource}
               scroll={{ x: this.state.tableWidth }}
               loading={this.state.dataLoading}
               bordered
        />
      </div>
    );
  };

  render() {
    return (
      <div>
        {this.renderTable()}
      </div>
    );
  }

}
