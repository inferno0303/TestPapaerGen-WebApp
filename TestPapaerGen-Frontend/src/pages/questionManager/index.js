import React from 'react';
import { connect, history } from 'umi';
import { delay } from "../../utils/myUtils";
import moment from 'moment';
import { Badge, Button, Input, PageHeader, Popconfirm, Select, Table, Tag } from 'antd';
import { FileAddOutlined, SearchOutlined, PieChartOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import style from './index.less';

function mapStateToProps({ questionManager, questionGenerator }) {
  const { questionList } = questionManager;
  const { testPaperGenList } = questionGenerator;
  return { questionList, testPaperGenList };
}

class QuestionManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isSelectedVisible: false, // 已选择的题目界面
      isOverviewVisible: false // 概览界面
    };
  }

  // initData
  initData = async () => {
    document.title = "题库管理";
    await this.setState({ isLoading: true });
    await this.props.dispatch({ type: 'questionManager/getQuestionList' });
    await delay(200);
    await this.setState({ isLoading: false });
  };

  // lifeCycle
  componentDidMount() {
    this.initData().then(null);
  }

  render() {
    return <div>hello world</div>
  }

}

export default connect(mapStateToProps)(QuestionManager);