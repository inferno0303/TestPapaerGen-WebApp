import React from 'react';
import { connect, history } from 'umi';
import {
  Button,
  Card,
  Descriptions,
  Divider,
  Input,
  InputNumber,
  PageHeader,
  Popover, Radio,
  Select,
  Spin,
  Switch,
  Tag,
  Tooltip
} from "antd";
import { QuestionCircleOutlined, StopOutlined, EyeOutlined, CheckCircleOutlined } from '@ant-design/icons';
import style from './index.less';
import { myEmptyStatus } from '../../layouts/commonComponents';
// echarts 按需加载
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import ReactEcharts from 'echarts-for-react';


class questionGenerator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 按钮loading
      btnLoading: false,
      genBtnLoading: false,
      // 组卷参数设置
      testPaperName: "试卷_" + new Date().getTime(),
      // 随机选择开关
      randomSwitch: true,
      // 遗传算法
      geneticSelect: 0,
      // 迭代次数
      iterationsNum: 400,
      TKTCount: 10,
      XZTCount: 10,
      PDTCount: 5,
      JDTCount: 2,
      averageDifficulty: 2.75,
      chapter1Range: [],
      generateRange: [],
    }
  }

  // btn handler
  // 自动组卷！
  autoGenerate = async () => {
    await this.setState({ btnLoading: true });
    await this.props.dispatch({type: 'questionGenerator/emptyList'});
    let selectedTopicIds = [];
    await this.props.testPaperGenList.forEach(item => {selectedTopicIds.push(item.id)});
    let payload = {
      selectedTopicIds: selectedTopicIds,
      TKTCount: this.state.TKTCount,
      XZTCount: this.state.XZTCount,
      PDTCount: this.state.PDTCount,
      JDTCount: this.state.JDTCount,
      averageDifficulty: this.state.averageDifficulty,
      generateRange: this.state.generateRange
    };
    if (this.state.geneticSelect === 0) {
      await this.props.dispatch({type: 'questionGenerator/randomSelect', payload: payload});
    } else if (this.state.geneticSelect === 1) {
      payload["iterationsNum"] = this.state.iterationsNum;
      await this.props.dispatch({type: 'questionGenerator/geneticSelect', payload: payload});
    }
    await this.setState({btnLoading: false});
  };
  // 生成试卷按钮
  handleClickGenTestPaper = async () => {
    await this.setState({genBtnLoading: true});
    let questionIdList = [];
    await this.props.testPaperGenList.forEach(item => {questionIdList.push(item.id)});
    await this.props.dispatch({type: 'questionGenerator/questionGen2', payload: {questionIdList: questionIdList, randomSwitch: this.state.randomSwitch, testPaperName: this.state.testPaperName}});
    await this.setState({genBtnLoading: false});
  };

  // data calc
  // 计算所有题目的总数
  getAllTopicCount = () => {
    return this.props.testPaperGenList.length + this.props.TKTList.length + this.props.PDTList.length + this.props.JDTList.length + this.props.XZTList.length;
  };
  // 计算自动出题的总数
  getRandomSelectTopicCount = () => {
    return this.props.TKTList.length + this.props.PDTList.length + this.props.JDTList.length + this.props.XZTList.length;
  };
  // 计算总平均难度
  calcAllAvgDifficulty = () => {
    const _totalCount = this.props.testPaperGenList.length + this.props.TKTList.length + this.props.PDTList.length + this.props.JDTList.length + this.props.XZTList.length;
    if (_totalCount === 0) return "无";
    let _sumDifficulty = 0.0;
    this.props.testPaperGenList.forEach(item => {
      _sumDifficulty += item.difficulty;
    });
    this.props.TKTList.forEach(item => {
      _sumDifficulty += item.difficulty;
    });
    this.props.PDTList.forEach(item => {
      _sumDifficulty += item.difficulty;
    });
    this.props.JDTList.forEach(item => {
      _sumDifficulty += item.difficulty;
    });
    this.props.XZTList.forEach(item => {
      _sumDifficulty += item.difficulty;
    });
    return (_sumDifficulty / _totalCount).toFixed(2)
  };
  // 计算手动选择的题目难度
  calcManualSelectTopicDifficulty = () => {
    if (this.props.testPaperGenList.length === 0) return "无";
    let _sumDifficulty = 0.0;
    this.props.testPaperGenList.forEach(item => {
      _sumDifficulty += item.difficulty;
    });
    return (_sumDifficulty / this.props.testPaperGenList.length).toFixed(2)
  };
  // 计算自动出题平均难度
  calcRandomSelectTopicDifficulty = () => {
    const _totalCount = this.props.TKTList.length + this.props.PDTList.length + this.props.JDTList.length + this.props.XZTList.length;
    if (_totalCount === 0) return "无";
    let _sumDifficulty = 0.0;
    this.props.TKTList.forEach(item => {
      _sumDifficulty += item.difficulty;
    });
    this.props.PDTList.forEach(item => {
      _sumDifficulty += item.difficulty;
    });
    this.props.JDTList.forEach(item => {
      _sumDifficulty += item.difficulty;
    });
    this.props.XZTList.forEach(item => {
      _sumDifficulty += item.difficulty;
    });
    return (_sumDifficulty / _totalCount).toFixed(2)
  };

  // 生成echarts的配置项
  getEchartsOption = () => {
    let TKTCount = this.props.TKTList.length;
    let XZTCount = this.props.PDTList.length;
    let PDTCount = this.props.JDTList.length;
    let JDTCount = this.props.XZTList.length;
    this.props.testPaperGenList.forEach(item => {
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
            {value: JDTCount, name: '程序设计题/程序阅读题'}
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

  getVarianceEchartsOption = () => {
    return {
      xAxis: {
        type: 'category',
        name: '迭代次数'
      },
      yAxis: {
        type: 'value',
        name: '与预期难度的方差'
      },
      tooltip: {
        trigger: 'axis',
        formatter: '遗传迭代次数：{b}<br />当前方差： {c}'
      },
      series: [
        {
          data: this.props.variance,
          type: 'line',
          lineStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'red' // 0% 处的颜色
              }, {
                offset: 1, color: 'blue' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          },
          smooth: true
        }
      ]
    };
  };

  // non-jsx render（手动更新非react组件，比如绘制canvas）

  // init Data
  initData = async () => {
    await this.props.dispatch({type: 'questionEdit/getAllQuestionLabels'});
    this.setState({
      chapter1Range: this.props.label1,
      generateRange: this.props.label1
    })
  };


  // lifeCycle
  componentDidMount() {
    this.initData().then(null);
  }

  render() {

    const renderManualTopic = () => {
      if (this.props.testPaperGenList.length > 0) {
        return this.props.testPaperGenList.map((item, index) => {
          return (
            <Descriptions span={1} key={index}>
              <Descriptions.Item>{index + 1}、(本题{item.score}分) {item.topic}</Descriptions.Item>
            </Descriptions>
          )
        })
      } else return myEmptyStatus("无数据", "200px")
    };

    const renderRandomTopic = () => {
      return <div>
        {
          this.state.geneticSelect === 1 ?
            <div>
              <Divider orientation='left' style={{fontWeight: 'bold', fontSize: '1em'}}>遗传迭代算法 「自动出题难度」与「预期难度」的方差变化</Divider>
              <code style={{color: "#666", fontSize: "0.8em", paddingRight: "15px"}}>初始方差：{this.props.variance.length > 0 ? this.props.variance[0] : null}</code>
              <code style={{color: "#666", fontSize: "0.8em", paddingRight: "15px"}}>方差收敛于：{this.props.variance.length > 0 ? this.props.variance[this.props.variance.length - 1] : null}</code>
              <code style={{color: "#666", fontSize: "0.8em", paddingRight: "15px"}}>迭代次数：{this.props.variance.length}</code>
              <ReactEcharts option={this.getVarianceEchartsOption()} id="variance" style={{ width: '100%', height: this.props.variance.length > 0 ? '250px' : '0', transition: 'all 1s' }} />
            </div> :
            null
        }
        <Divider orientation='left' style={{fontWeight: 'bold'}}>填空题，共{this.props.TKTList.length}题</Divider>
        {
          this.props.TKTList.length > 0 ?
            this.props.TKTList.map((item, index) => {
              return <Descriptions span={1} key={index}>
                <Descriptions.Item>{index + 1}、(本题{item.score}分) {item.topic}</Descriptions.Item>
              </Descriptions>
            }) :
            myEmptyStatus("无数据", "200px")
        }
        <Divider orientation='left' style={{fontWeight: 'bold'}}>选择题，共{this.props.XZTList.length}题</Divider>
        {
          this.props.XZTList.length > 0 ?
            this.props.XZTList.map((item, index) => {
              return <Descriptions span={1} key={index}>
                <Descriptions.Item>{index + 1}、(本题{item.score}分) {item.topic}</Descriptions.Item>
              </Descriptions>
            }) :
            myEmptyStatus("无数据", "200px")
        }
        <Divider orientation='left' style={{fontWeight: 'bold'}}>判断题，共{this.props.PDTList.length}题</Divider>
        {
          this.props.PDTList.length > 0 ?
            this.props.PDTList.map((item, index) => {
              return <Descriptions span={1} key={index}>
                <Descriptions.Item>{index + 1}、(本题{item.score}分) {item.topic}</Descriptions.Item>
              </Descriptions>
            }) :
            myEmptyStatus("无数据", "200px")
        }
        <Divider orientation='left' style={{fontWeight: 'bold'}}>程序设计题/程序阅读题，共{this.props.JDTList.length}题</Divider>
        {
          this.props.JDTList.length > 0 ?
            this.props.JDTList.map((item, index) => {
              return <Descriptions span={1} key={index}>
                <Descriptions.Item>{index + 1}、(本题{item.score}分) {item.topic}</Descriptions.Item>
              </Descriptions>
            }) :
            myEmptyStatus("无数据", "200px")
        }
      </div>
    };

    const renderSummary = () => {
      return <div>
        <div className={style.middle_line_space}>
          <span>题目总数：</span>
          <Tag>
            {this.getAllTopicCount()}
          </Tag>
        </div>
        <div className={style.middle_line_space}>
          <span>平均难度：</span>
          <Tag>
            {this.calcAllAvgDifficulty()}
          </Tag>
          <Popover content="显示手动选择的题目和自动出题的平均难度">
            <QuestionCircleOutlined />
          </Popover>
        </div>
        <div className={style.middle_line_space}>
          <span>手动选择：</span>
          <Tag>{this.props.testPaperGenList.length}</Tag>
        </div>
        <div className={style.middle_line_space}>
          <span>手动选择的题目难度：</span>
          <Tag>
            {this.calcManualSelectTopicDifficulty()}
          </Tag>
          <Popover content="显示手动选择题目的平均难度">
            <QuestionCircleOutlined />
          </Popover>
        </div>
        <div className={style.middle_line_space}>
          <span>自动出题数：</span>
          <Tag>{this.getRandomSelectTopicCount()}</Tag>
        </div>
        <div className={style.middle_line_space}>
          <span>自动出题难度：</span>
          <Tag>
            {this.calcRandomSelectTopicDifficulty()}
          </Tag>
          <Popover title="为什么与预设值不相符？" content="题库中没有相应的符合预设要求的题目，会自动选取与预设值相近的题目">
            <QuestionCircleOutlined />
          </Popover>
        </div>
        <Divider/>
        <ReactEcharts option={this.getEchartsOption()} id="summary_echarts" style={{ width: '100%', height: this.getAllTopicCount() > 0 ? '180px' : '0', transition: 'all 1s' }} />
        <span>输入试卷名称（备注）：</span>
        <Input onChange={e => this.setState({testPaperName: e.target.value})}
               value={this.state.testPaperName}
        />
        <Divider />
        <Button icon={<CheckCircleOutlined />}
                onClick={this.handleClickGenTestPaper}
                type='primary'
                style={{display: 'block', margin: '5px auto'}}
                loading={this.state.genBtnLoading}
                disabled={this.props.testPaperGenList.length + this.props.TKTList.length + this.props.PDTList.length + this.props.JDTList.length + this.props.XZTList.length <= 0 }
        >
          立即生成试卷word文档
        </Button>
      </div>
    };

    const renderActionBox = () => {
      return <div>
        <Spin spinning={!this.state.randomSwitch} indicator={<StopOutlined />} tip='关闭自动组卷功能，当前手动组卷'>
          <div className={style.text_line_space}>
            <span>试卷随机出题总数：</span>
            <Tag>{this.state.TKTCount + this.state.XZTCount + this.state.PDTCount + this.state.JDTCount}</Tag>
          </div>
          <Divider />
          <div className={style.middle_line_space}>自动出 填空题 总数：</div>
          <InputNumber type='number' min={1} max={100} value={this.state.TKTCount} onChange={value => this.setState({TKTCount: value})} className={style.wrapper_params_input} />
          <div className={style.middle_line_space}>自动出 选择题 总数：</div>
          <InputNumber type='number' min={1} max={100} value={this.state.XZTCount} onChange={value => value ? this.setState({XZTCount: value}) : null} className={style.wrapper_params_input} />
          <div className={style.middle_line_space}>自动出 判断题 总数：</div>
          <InputNumber type='number' min={1} max={100} value={this.state.PDTCount} onChange={value => value ? this.setState({PDTCount: value}) : null} className={style.wrapper_params_input} />
          <div className={style.middle_line_space}>自动出 简答题 总数：</div>
          <InputNumber type='number' min={1} max={100} value={this.state.JDTCount} onChange={value => value ? this.setState({JDTCount: value}) : null} className={style.wrapper_params_input} />
          <div className={style.middle_line_space}>设置总体难度：</div>
          <InputNumber type='number' min={1} max={5} value={this.state.averageDifficulty} onChange={value => value ? this.setState({averageDifficulty: value}) : null} className={style.wrapper_params_input} />
          <div className={style.middle_line_space}>设置出题知识点：</div>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="请选择出题范围"
            value={this.state.generateRange}
            onChange={value => this.setState({generateRange: value})}
          >
            {this.state.chapter1Range.map((item, index) => (
              <Select.Option key={index} value={item}>{item}</Select.Option>
            ))}
          </Select>
          <Divider />
          <Radio.Group onChange={e => this.setState({geneticSelect: e.target.value})} value={this.state.geneticSelect}>
            <Radio value={0}>贪心最优算法</Radio>
            <Radio value={1}>遗传迭代算法</Radio>
          </Radio.Group>
          <div className={style.middle_line_space}>设置遗传迭代次数：</div>
          <InputNumber type='number' min={0} max={10000} value={this.state.iterationsNum} disabled={this.state.geneticSelect !== 1} onChange={value => value ? this.setState({iterationsNum: value}) : null} className={style.wrapper_params_input} />
          <Divider />
          <Tooltip placement="topLeft" title="结果会显示在左侧【自动组卷】面板">
            <Button icon={<CheckCircleOutlined />}
                    onClick={this.autoGenerate}
                    type='primary'
                    loading={this.state.btnLoading}
                    style={{display: 'block', margin: '5px auto', width: '130px'}}
            >
              自动组卷！
            </Button>
          </Tooltip>
        </Spin>
      </div>
    };

    return <div>
      <PageHeader title={'试题组卷' + '（当前共' + this.getAllTopicCount() + '题）'}
                  subTitle={'预览即将生成的试题，或调整随机抽题参数'}
                  extra={[
                    <Button type='primary' icon={<EyeOutlined />} onClick={() => {history.push("/questionGenHistory")}} key='1'>查看出题历史</Button>
                  ]}
      />
      <div className={style.flex_wrapper}>
        {/*左侧题目预览*/}
        {/*手动出题预览*/}
        <div className={style.wrapper_left_side}>
          <Card title={<span className={style.preview_title}>手动出题，当前已手动选择{this.props.testPaperGenList.length}题</span>}>
            {renderManualTopic()}
          </Card>
          <Divider />
          {/*自动组卷预览*/}
          {
            this.state.randomSwitch ?
              <Card title={<span className={style.preview_title}>自动组卷 {this.state.geneticSelect === 1 ? <Tag color="magenta">遗传迭代算法</Tag> : <Tag color="geekblue">贪心最优算法</Tag>}</span>}>
                {renderRandomTopic()}
              </Card> :
              null
          }
        </div>
        {/*右侧自动组卷功能*/}
        <div className={style.wrapper_right_side}>
          <Card title={<div className={style.preview_title}>
            <span style={{marginRight: '20px'}}>自动组卷功能</span>
            <Switch checked={this.state.randomSwitch}
                    onChange={checked => this.setState({randomSwitch: checked})}
                    checkedChildren="开自动组卷"
                    unCheckedChildren="关自动组卷"
            />
          </div>}>
            {renderActionBox()}
          </Card>
        </div>
        {/*右侧生成试卷功能*/}
        <div className={style.wrapper_right_side}>
          <Card title={<span className={style.preview_title}>这份试卷的统计信息</span>}>
            {renderSummary()}
          </Card>
        </div>
      </div>
    </div>;
  }
}

function mapStateToProps({ questionGenerator, questionEdit }) {
  const { testPaperGenList, TKTList, PDTList, JDTList, XZTList, variance } = questionGenerator;
  const { allQuestionLabels, chapter1, chapter2, label1, label2 } = questionEdit;
  return { testPaperGenList, TKTList, PDTList, JDTList, XZTList, variance, allQuestionLabels, chapter1, chapter2, label1, label2 };
}

export default connect(mapStateToProps)(questionGenerator);
