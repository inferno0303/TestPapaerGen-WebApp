import React from 'react';
import { connect } from 'umi';
import { Divider, PageHeader } from 'antd';
import AdminTable from './adminTable';
import AllUserTable from './allUserTable';


class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  // handle

  // life cycle
  initData = async () => {

  };

  componentWillMount() {
    this.initData().then(()=>null)
  }

  render() {
    return (
      <div>
        <PageHeader title={'管理员账户管理'} subTitle={'支持对用户账号进行管理'} />
        <Divider orientation='left' style={{fontWeight: 'bold'}}>等待审批的注册教工用户</Divider>
        <AdminTable dataSource={this.props.applyUser}
                    dispatch={this.props.dispatch}
        />
        <Divider orientation='left' style={{fontWeight: 'bold'}}>当前系统用户管理</Divider>
        <AllUserTable
          dataSource={this.props.allUser}
          dispatch={this.props.dispatch}
        />
      </div>
    )
  }


}

function mapStateToProps({ loginModel }) {
  const { applyUser, allUser } = loginModel;
  return { applyUser, allUser };
}

export default connect(mapStateToProps)(Admin);
