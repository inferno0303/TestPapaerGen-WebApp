import React from 'react';
import { connect, history } from 'umi';
import { Menu } from 'antd';
import {
  HomeOutlined,
  OrderedListOutlined,
  EditOutlined,
  FileAddOutlined,
  HistoryOutlined,
  UserOutlined,
  LoginOutlined
} from '@ant-design/icons';

class TopMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  // handler
  handleClick = e => {
    if (history.location.pathname !== e.key) history.push(e.key);
  };

  componentWillMount() {
    this.props.dispatch({type: 'loginModel/getLoginStatus'})
  }

  render() {

    const renderMenu = () => {
      if (history.location.pathname === '/') return null;
      else if (history.location.pathname === '/admin') return <Menu mode="horizontal" theme='dark' onClick={this.handleClick} selectedKeys={history.location.pathname}>
        <Menu.Item key="/admin">
          <HomeOutlined />
          管理员首页
        </Menu.Item>
        <Menu.Item key="/login" style={{float: 'right'}}>
          <LoginOutlined />
          回登陆页
        </Menu.Item>
      </Menu>;
      else return <Menu mode="horizontal" theme='dark' onClick={this.handleClick} selectedKeys={history.location.pathname}>
          <Menu.Item key="/home">
            <HomeOutlined />
            系统首页
          </Menu.Item>
          <Menu.Item key="/questionBank">
            <OrderedListOutlined />
            全部试题
          </Menu.Item>
          <Menu.Item key="/questionEdit">
            <EditOutlined />
            题目编辑
          </Menu.Item>
          <Menu.Item key="/questionGenerator">
            <FileAddOutlined />
            抽取试题
          </Menu.Item>
          <Menu.Item key="/questionGenHistory">
            <HistoryOutlined />
            出题历史
          </Menu.Item>
          <Menu.Item key="/login" style={{float: 'right'}}>
            <UserOutlined />
            {this.props.username}
          </Menu.Item>
        </Menu>
    };

    return <div>
      {
        renderMenu()
      }
      <div>
        { this.props.children }
      </div>
    </div>;
  }
}

function mapStateToProps({ loginModel }) {
  const { username } = loginModel;
  return { username };
}

export default connect(mapStateToProps)(TopMenu);
