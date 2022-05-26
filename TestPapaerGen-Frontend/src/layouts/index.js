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

  componentWillMount() {
    this.props.dispatch({type: 'loginModel/getLoginStatus'})
  }

  render() {
    const onClick = e => {
      if (history.location.pathname !== e.key) history.push(e.key);
    };
    const menu = () => {
      if (history.location.pathname === "/") {
        return null;
      }
      else if (history.location.pathname === "admin") {
        const items = [
          {
            key: "/admin",
            icon: <HomeOutlined />,
            label: "管理员首页"
          },
          {
            key: "/login",
            icon: <LoginOutlined />,
            label: "退出"
          }
        ]
        return <Menu items={items} mode="horizontal" theme='dark' onClick={onClick} selectedKeys={history.location.pathname} />
      }
      else {
        const items = [
          {
            key: "/home",
            icon: <HomeOutlined />,
            label: "首页"
          },
          {
            key: "/questionBank",
            icon: <OrderedListOutlined />,
            label: "试题库显示"
          },
          {
            key: "/questionEdit",
            icon: <EditOutlined />,
            label: "添加或修改"
          },
          {
            key: "/questionGenerator",
            icon: <FileAddOutlined />,
            label: "组卷功能"
          },
          {
            key: "/questionGenHistory",
            icon: <HistoryOutlined />,
            label: "出题历史"
          },
          {
            key: "/login",
            icon: <UserOutlined />,
            label: `退出登陆：${this.props.username}`
          }
        ]
        return <Menu items={items}
                     mode="horizontal"
                     theme='dark'
                     onClick={onClick}
                     selectedKeys={history.location.pathname}
        />
      }
    }

    return <div>
        <div id="headers">
          {
            menu()
          }
        </div>
        <div id="contents">
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
