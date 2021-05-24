import React from 'react';
import { Button, Popconfirm, Popover, Table } from 'antd';
import moment from 'moment';
import style from '../questionBank/index.less';

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
        title: '试卷id',
        dataIndex: 'test_paper_uid',
        key: 'test_paper_uid',
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
          <Popconfirm title={`你确定要删除该历史记录吗？`}
                      onConfirm={this.deleteRecord.bind(this, record)}
                      okText="确定"
                      okButtonProps={{ danger: true }}
                      cancelText="取消"
                      placement="rightBottom"
          >
            <Button type='link'>删除记录</Button>
          </Popconfirm>
        </div>
      },
    ];
    this.state = {
      dataLoading: false,
      tableWidth: 'max-content'
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

  renderTable = () => {
    return (
      <div>
        <Table columns={this.columns}
               dataSource={this.props.dataSource}
               scroll={{ x: this.state.tableWidth }}
               bordered
        />
      </div>
    )
  };

  initData = async () => {
    await this.setState({dataLoading: true});
    await this.props.dispatch({type:'questionGenHistory/getAllTestPaperGenHistory'});
    await this.setState({dataLoading: false});
  };

  componentWillMount() {
    this.initData().then(() => null)
  }

  render() {
    return (
      <div>
        {this.renderTable()}
      </div>
    );
  }

}
