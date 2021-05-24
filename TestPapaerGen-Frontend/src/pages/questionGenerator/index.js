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
  Popover,
  Select,
  Spin,
  Switch,
  Tag,
} from 'antd';
import { QuestionCircleOutlined, StopOutlined, EyeOutlined } from '@ant-design/icons';
import style from './index.less';
import { myEmptyStatus } from '../../layouts/commonComponents';
// echarts 按需加载
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import ReactEcharts from 'echarts-for-react';


const renderTopicType = text => {
  switch (text) {
    case '填空题':
      return <Tag color='blue'>{text}</Tag>;
    case '选择题':
      return <Tag color='volcano'>{text}</Tag>;
    case '判断题':
      return <Tag color='purple'>{text}</Tag>;
    case '程序设计题':
      return <Tag color='green'>{text}</Tag>;
    case '程序阅读题':
      return <Tag color='cyan'>{text}</Tag>;
  }
};

class questionGenerator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 按钮loading
      randomSelectBtnLoading: false,
      genBtnLoading: false,
      // 组卷参数设置
      testPaperName: '',
      // 随机选择开关
      randomSwitch: true,
      TKTCount: 4,
      XZTCount: 4,
      PDTCount: 4,
      JDTCount: 2,
      averageDifficulty: 3,
      chapter1Range: ['绪论', 'Intel8086微处理器', '宏汇编语言程序设计', 'Intel80486微处理器', '半导体存储器', 'I/O接口技术', '中断系统', '常用接口芯片'],
      generateRange: ['绪论', 'Intel8086微处理器', '宏汇编语言程序设计', 'Intel80486微处理器', '半导体存储器', 'I/O接口技术', '中断系统', '常用接口芯片'],
    }
  }

  // btn handler
  // 随机选择按钮
  handleRandomSelect = async () => {
    await this.setState({randomSelectBtnLoading: true});
    let selectedTopicIds = [];
    await this.props.testPaperGenList.forEach(item => {selectedTopicIds.push(item.id)});
    const payload = {
      selectedTopicIds: selectedTopicIds,
      TKTCount: this.state.TKTCount,
      XZTCount: this.state.XZTCount,
      PDTCount: this.state.PDTCount,
      JDTCount: this.state.JDTCount,
      averageDifficulty: this.state.averageDifficulty,
      generateRange: this.state.generateRange
    };
    await this.props.dispatch({type: 'questionGenerator/randomSelect', payload: payload});
    await this.setState({randomSelectBtnLoading: false});

  };
  // 生成试卷按钮
  handleClickGenTestPaper = async () => {
    await this.setState({genBtnLoading: true});
    let questionIdList = [];
    await this.props.testPaperGenList.forEach(item => {questionIdList.push(item.id)});
    await this.props.dispatch({type: 'questionGenerator/questionGen', payload: {questionIdList: questionIdList, randomSwitch: this.state.randomSwitch, testPaperName: this.state.testPaperName}});
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

  // non-jsx render（手动更新非react组件，比如绘制canvas）

  // init Data
  initData = async () => {

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
        <Divider orientation='left' style={{fontWeight: 'bold'}}>随机填空题，共{this.props.TKTList.length}题</Divider>
        {
          this.props.TKTList.length > 0 ?
            this.props.TKTList.map((item, index) => {
              return <Descriptions span={1} key={index}>
                <Descriptions.Item>{index + 1}、(本题{item.score}分) {item.topic}</Descriptions.Item>
              </Descriptions>
            }) :
            myEmptyStatus("无数据", "200px")
        }
        <Divider orientation='left' style={{fontWeight: 'bold'}}>随机选择题，共{this.props.XZTList.length}题</Divider>
        {
          this.props.XZTList.length > 0 ?
            this.props.XZTList.map((item, index) => {
              return <Descriptions span={1} key={index}>
                <Descriptions.Item>{index + 1}、(本题{item.score}分) {item.topic}</Descriptions.Item>
              </Descriptions>
            }) :
            myEmptyStatus("无数据", "200px")
        }
        <Divider orientation='left' style={{fontWeight: 'bold'}}>随机判断题，共{this.props.PDTList.length}题</Divider>
        {
          this.props.PDTList.length > 0 ?
            this.props.PDTList.map((item, index) => {
              return <Descriptions span={1} key={index}>
                <Descriptions.Item>{index + 1}、(本题{item.score}分) {item.topic}</Descriptions.Item>
              </Descriptions>
            }) :
            myEmptyStatus("无数据", "200px")
        }
        <Divider orientation='left' style={{fontWeight: 'bold'}}>随机程序设计题/程序阅读题，共{this.props.JDTList.length}题</Divider>
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
          <span>当前试卷题目总数：</span>
          <Tag>
            {this.getAllTopicCount()}
          </Tag>
        </div>
        <div className={style.middle_line_space}>
          <span>当前试卷平均难度：</span>
          <Tag>
            {this.calcAllAvgDifficulty()}
          </Tag>
          <Popover content="显示手动选择的题目和自动出题的平均难度">
            <QuestionCircleOutlined />
          </Popover>
        </div>
        <div className={style.middle_line_space}>
          <span>手动选择的题目数：</span>
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
          <span>系统自动出题的题目数：</span>
          <Tag>{this.getRandomSelectTopicCount()}</Tag>
        </div>
        <div className={style.middle_line_space}>
          <span>系统自动出题的难度：</span>
          <Tag>
            {this.calcRandomSelectTopicDifficulty()}
          </Tag>
          <Popover title="为什么与预设值不相符？" content="题库中没有相应的符合预设要求的题目，会自动选取与预设值相近的题目">
            <QuestionCircleOutlined />
          </Popover>
        </div>
        <ReactEcharts option={this.getEchartsOption()} id="summary_echarts" style={{ width: '100%', height: this.getAllTopicCount() > 0 ? '180px' : '0', transition: 'all 1s' }} />
        <span>输入试卷名称：</span>
        <Input onChange={e => this.setState({testPaperName: e.target.value})}
               value={this.state.testPaperName}
        />
        <Button onClick={this.handleClickGenTestPaper}
                type='primary'
                style={{display: 'block', margin: '5px auto', width: '130px'}}
                loading={this.state.genBtnLoading}
        >
          生成试卷
        </Button>
      </div>
    };

    const renderActionBox = () => {
      return <div>
        <Spin spinning={!this.state.randomSwitch} indicator={<StopOutlined />} tip='禁用随机组卷'>
          <div className={style.text_line_space}>
            <span>试卷随机出题总数：</span>
            <Tag>{this.state.TKTCount + this.state.XZTCount + this.state.PDTCount + this.state.JDTCount}</Tag>
          </div>
          <div className={style.middle_line_space}>预计{renderTopicType('填空题')}总数：</div>
          <InputNumber type='number' min={1} max={100} value={this.state.TKTCount} onChange={value => this.setState({TKTCount: value})} className={style.wrapper_params_input} />
          <div className={style.middle_line_space}>预计{renderTopicType('选择题')}总数：</div>
          <InputNumber type='number' min={1} max={100} value={this.state.XZTCount} onChange={value => value ? this.setState({XZTCount: value}) : null} className={style.wrapper_params_input} />
          <div className={style.middle_line_space}>预计{renderTopicType('判断题')}总数：</div>
          <InputNumber type='number' min={1} max={100} value={this.state.PDTCount} onChange={value => value ? this.setState({PDTCount: value}) : null} className={style.wrapper_params_input} />
          <div className={style.middle_line_space}>预计{renderTopicType('程序设计题')}{renderTopicType('程序阅读题')}总数：</div>
          <InputNumber type='number' min={1} max={100} value={this.state.JDTCount} onChange={value => value ? this.setState({JDTCount: value}) : null} className={style.wrapper_params_input} />
          <div className={style.middle_line_space}>随机出题预期难度系数：</div>
          <InputNumber type='number' min={1} max={5} value={this.state.averageDifficulty} onChange={value => value ? this.setState({averageDifficulty: value}) : null} className={style.wrapper_params_input} />
          <div className={style.middle_line_space}>指定随机出题范围(按章节)：</div>
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
          <Button onClick={this.handleRandomSelect}
                  type='primary'
                  loading={this.state.randomSelectBtnLoading}
                  style={{display: 'block', margin: '5px auto', width: '130px'}}
          >
            随机抽取试题
          </Button>
        </Spin>
      </div>
    };

    return <div>
      <PageHeader title={'试题抽取' + '（当前共' + this.getAllTopicCount() + '题）'}
                  subTitle={'预览即将生成的试题，或调整随机抽题参数'}
                  extra={[
                    <Button type='primary' icon={<EyeOutlined />} onClick={() => {history.push("/questionGenHistory")}} key='1'>查看历史</Button>
                  ]}
      />
      {/*左侧*/}
      <div className={style.wrapper_two_side}>
        <div className={style.wrapper_left_side}>
          <Card title={<span className={style.preview_title}>预览指定试题，共{this.props.testPaperGenList.length}题</span>}>
            {renderManualTopic()}
          </Card>
          {
            this.state.randomSwitch ?
              <Card title={<span className={style.preview_title}>预览随机出题</span>}>
                {renderRandomTopic()}
              </Card> :
              null
          }
        </div>
        {/*右侧*/}
        <div className={style.wrapper_right_side}>
          <Card title={<span className={style.preview_title}>生成试卷</span>}>
            {renderSummary()}
          </Card>
          <Card title={<div className={style.preview_title}>
            <span style={{marginRight: '20px'}}>随机组卷</span>
            <Switch checked={this.state.randomSwitch}
                    onChange={checked => this.setState({randomSwitch: checked})}
                    checkedChildren="开"
                    unCheckedChildren="关"
            />
          </div>}>
            {renderActionBox()}
          </Card>
        </div>
      </div>
    </div>;
  }
}

function mapStateToProps({ questionGenerator }) {
  const { testPaperGenList, TKTList, PDTList, JDTList, XZTList } = questionGenerator;
  return { testPaperGenList, TKTList, PDTList, JDTList, XZTList };
}

export default connect(mapStateToProps)(questionGenerator);
