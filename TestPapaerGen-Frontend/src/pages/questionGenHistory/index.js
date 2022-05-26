import React from 'react';
import { connect } from 'umi';
import { Button, Form, Input, InputNumber, PageHeader, Select } from 'antd';
import { HistoryOutlined } from '@ant-design/icons';
import * as myUtils from '../../utils/myUtils';
import { delay } from '../../utils/myUtils';
import style from './index.less';
import { renderLoading } from '../../layouts/commonComponents';
import MainTable from './mainTable';
import ReportDrawer from './reportDrawer';


class QuestionGenHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReportDrawerVisible: false,
    }
  }

  // handler
  showReportDrawer = async uid => {
    this.props.dispatch({type: 'questionGenHistory/getQuestionGenHistoriesByTestPaperUid', payload: {test_paper_uid: uid}});
    this.setState({ isReportDrawerVisible: true })
  };
  hideReportDrawer = () => {
    this.setState({ isReportDrawerVisible: false })
  };

  componentDidMount() {
  }

  render() {

    return (
      <div>
        <PageHeader title={'出题历史'} subTitle={'支持查看出题历史和试卷报告'} />
        <div style={{margin: "0 auto"}}>
          <MainTable dataSource={this.props.testPaperGenHistories}
                     dispatch={this.props.dispatch}
                     showReportDrawer={this.showReportDrawer}
                     username={this.props.username}
                     loading={this.state.isLoading}
          />
        </div>
        <ReportDrawer visible={this.state.isReportDrawerVisible}
                      close={this.hideReportDrawer}
                      destroyOnClose={true}
        />
      </div>
    )
  }
}

function mapStateToProps({ questionGenHistory, loginModel }) {
  const { testPaperGenHistories } = questionGenHistory;
  const { username } = loginModel;
  return { testPaperGenHistories, username }
}

export default connect(mapStateToProps)(QuestionGenHistory);
