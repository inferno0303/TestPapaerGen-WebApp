import React from 'react';
import { connect } from 'umi';
import { Button, Descriptions, Divider, Drawer, PageHeader, Popconfirm, Progress, Tag } from 'antd';
import { myEmptyStatus, renderLoading } from '../../layouts/commonComponents';
import ReactEcharts from 'echarts-for-react';
import style from './index.less'
import { delay } from '../../utils/myUtils';

class ReportDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  initData = async () => {
  };

  componentWillMount() {
    this.initData().then(() => null)
  }

  // 难度数量统计
  getOption1 = () => {
    let Difficulty1 = 0;
    let Difficulty2 = 0;
    let Difficulty3 = 0;
    let Difficulty4 = 0;
    let Difficulty5 = 0;
    this.props.testPaperReportQuestionList.forEach(item => {
      if (item.difficulty === 1) Difficulty1++;
      else if (item.difficulty === 2) Difficulty2++;
      else if (item.difficulty === 3) Difficulty3++;
      else if (item.difficulty === 4) Difficulty4++;
      else if (item.difficulty === 5) Difficulty5++;
    });
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c}题 ({d}%)'
      },
      series: [
        {
          name: '难度',
          type: 'pie',
          radius: [0, '50%'],
          label: {
            position: 'outside',
            fontSize: 10
          },
          labelLine: {
            length: 10,
            length2: 15,
            smooth: true
          },
          data: [
            {value: Difficulty1, name: '难度1'},
            {value: Difficulty2, name: '难度2'},
            {value: Difficulty3, name: '难度3'},
            {value: Difficulty4, name: '难度4'},
            {value: Difficulty5, name: '难度5'}
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
  };

  // 题目类型数量
  getOption2 = () => {
    let TKTCount = 0;
    let XZTCount = 0;
    let PDTCount = 0;
    let JDTCount = 0;
    this.props.testPaperReportQuestionList.forEach(item => {
      if (item.topic_type === '填空题') TKTCount++;
      else if (item.topic_type === '选择题') XZTCount++;
      else if (item.topic_type === '判断题') PDTCount++;
      else if (item.topic_type === '程序阅读题' || item.topic_type === '程序设计题') JDTCount++;
    });
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b}数量 : {c} ({d}%)'
      },
      series: [
        {
          name: '数量',
          type: 'pie',
          radius: [0, '50%'],
          label: {
            position: 'outside',
            fontSize: 10
          },
          labelLine: {
            length: 10,
            length2: 15,
            smooth: true
          },
          data: [
            {value: TKTCount, name: '填空题'},
            {value: XZTCount, name: '判断题'},
            {value: PDTCount, name: '选择题'},
            {value: JDTCount, name: '程序阅读题/程序设计题'}
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
  };

  // 单元题目统计
  getOption3 = () => {
    let _total = {};
    this.props.testPaperReportQuestionList.forEach(item => {
      if (_total[item.label_1] === undefined) {
        _total[item.label_1] = 0
      } else {
        _total[item.label_1]++
      }
    });
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)'
      },
      series: [
        {
          name: '数量',
          type: 'pie',
          radius: [0, '50%'],
          label: {
            position: 'outside',
            fontSize: 10
          },
          labelLine: {
            length: 10,
            length2: 15,
            smooth: true
          },
          data: Object.keys(_total).map(item => {
            return {value: _total[item], name: item}
          }),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
  };

  // 取试卷名字
  getTestPaperName = () => {
    if (this.props.testPaperReportQuestionList.length <= 0) return null
    if (this.props.testPaperReportQuestionList[0].test_paper_name === "") {
      return "《未命名试卷》";
    } else {
      return `《${this.props.testPaperReportQuestionList[0].test_paper_name}》`;
    }
  }

  render() {
    return (
      <Drawer title={null}
              placement="right"
              width={800}
              onClose={this.props.close}
              visible={this.props.visible}
      >
        <PageHeader title={`${this.getTestPaperName()}试卷出题历史记录`} subTitle={'详细记录'}/>

        <Divider orientation='left' style={{fontWeight: 'bold'}}>总体难度{this.props.reportDifficulty}</Divider>
        <div className={style.flex_middle}>
          <span className={style.text_two_side_padding}>难度1</span>
          <Progress percent={(this.props.reportDifficulty / 5 * 100).toFixed(2)}
                    strokeColor={{ '0%': '#00ff00', '100%': '#901300', }}
                    showInfo={false}
                    style={{width: '60%'}}
          />
          <span className={style.text_two_side_padding}>难度5</span>
        </div>

        <Divider orientation='left' style={{fontWeight: 'bold'}}>本试卷共{this.props.testPaperReportQuestionList.length}题</Divider>
        {
          this.props.testPaperReportQuestionList.length > 0 ?
            this.props.testPaperReportQuestionList.map((item, index) => {
              return <Descriptions span={1} key={index}>
                <Descriptions.Item contentStyle={{fontSize: "0.8em", color: "gray"}}>
                  <Tag color="magenta">第{index + 1}题（{item.score}分）</Tag>
                  {item.topic}
                </Descriptions.Item>
              </Descriptions>
            }) :
            myEmptyStatus("无数据", "200px")
        }

        <Divider orientation='left' style={{fontWeight: 'bold'}}>难度分布</Divider>
        {this.props.visible ? <ReactEcharts option={this.getOption1()} /> : null}

        <Divider orientation='left' style={{fontWeight: 'bold'}}>题型分布</Divider>
        <ReactEcharts option={this.getOption2()} />

        <Divider orientation='left' style={{fontWeight: 'bold'}}>知识点分布</Divider>
        <ReactEcharts option={this.getOption3()} />

        <Divider />

      </Drawer>
    )
  }

}
function mapStateToProps({ questionGenHistory }) {
  const { testPaperGenHistories, testPaperReportQuestionList, reportDifficulty } = questionGenHistory;
  return { testPaperGenHistories, testPaperReportQuestionList, reportDifficulty };
}

export default connect(mapStateToProps)(ReportDrawer);
