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


  // initData
  initData = async () => {
    await this.setState({isLoading: true});
    await delay(500);
    await this.setState({isLoading: false});
  };

  // lifeCycle
  componentDidMount() {
    this.initData().then(null);
  }

  render() {

    return (
      <div>
        <PageHeader title={'出题历史'} subTitle={'支持查看出题历史和试卷报告'} />
        <div className={style.main_wrapper}>
          <MainTable dataSource={this.props.testPaperGenHistories}
                     dispatch={this.props.dispatch}
                     showReportDrawer={this.showReportDrawer}
          />
        </div>
        <ReportDrawer visible={this.state.isReportDrawerVisible}
                      close={this.hideReportDrawer}
        />
      </div>
    )
  }
}

function mapStateToProps({ questionGenHistory }) {
  const { testPaperGenHistories } = questionGenHistory;
  return { testPaperGenHistories }
}

export default connect(mapStateToProps)(QuestionGenHistory);
