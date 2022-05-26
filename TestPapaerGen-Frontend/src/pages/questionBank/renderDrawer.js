import React from 'react';
import { Button, Collapse, Descriptions, Drawer, PageHeader, Popconfirm, Tag } from 'antd';
import { DeleteOutlined, ExportOutlined } from '@ant-design/icons';
import moment from 'moment';
import { myEmptyStatus } from '../../layouts/commonComponents';
import { connect, history } from 'umi';
import { delay } from '../../utils/myUtils';

const renderTopicType = text => {
  switch (text) {
    case '填空题': return <Tag color='blue'>{text}</Tag>;
    case '选择题': return <Tag color='red'>{text}</Tag>;
    case '简答题': return <Tag color='green'>{text}</Tag>;
  }
};

class RenderDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  // handler
  nextStep = async () =>
  {
    await this.props.hide();
    await delay(300);
    await history.push('/questionGenerator');
  };
  removeOne = (record) => {
    this.props.dispatch({type: 'questionGenerator/removeTestPaperGenList', payload: record})
  };
  removeAll = () => {
    this.props.dispatch({type: 'questionGenerator/removeAllTestPaperGenList'})
  };


  render() {
    return (
      <div>
        <Drawer title={null}
                placement="right"
                width={550}
                onClose={this.props.hide}
                visible={this.props.show}>
          <div>
            <PageHeader title={"已手动选择的题目"}
                        subTitle={'确认完成后请点击「导出word」按钮'}
                        extra={[
                          <Button type='primary' onClick={this.nextStep} key='1' icon={<ExportOutlined />}>生成组卷</Button>,
                          <Popconfirm title={`你确定要清空组卷列表吗？`}
                                      onConfirm={this.removeAll}
                                      okText="确定"
                                      okButtonProps={{danger: true}}
                                      cancelText="取消"
                                      placement="rightBottom"
                                      key="2"
                          >
                            <Button type='link' danger key='2'>清空全部</Button>
                          </Popconfirm>
                        ]}
            />
          </div>
          <Collapse accordion expandIconPosition='right'>
            {
              this.props.testPaperGenList.map((item, index) => {
                return (
                  <Collapse.Panel header={`${index + 1}、${item.topic.toString().length > 40 ? item.topic.toString().slice(0, 40) + '...' : item.topic.toString()}`}
                                  key={index}
                  >
                    <Descriptions bordered column={2} size={'small'} layout={'vertical'}>
                      <Descriptions.Item label="题目" span={2}>{item.topic}</Descriptions.Item>
                      <Descriptions.Item label="答案" span={2}>{item.answer}</Descriptions.Item>
                      <Descriptions.Item label="题目类型">{renderTopicType(item.topic_type)}</Descriptions.Item>
                      <Descriptions.Item label="分值">{item.score}</Descriptions.Item>
                      <Descriptions.Item label="大知识点">{item.chapter_1}</Descriptions.Item>
                      <Descriptions.Item label="小知识点">{item.chapter_2}</Descriptions.Item>
                      <Descriptions.Item label="小章节">{item.label_1}</Descriptions.Item>
                      <Descriptions.Item label="大章节">{item.label_2}</Descriptions.Item>
                      <Descriptions.Item label="更新时间"><span style={{fontSize: 'smaller'}}>{moment(item.update_time).format('YYYY-MM-DD HH:mm:ss')}</span></Descriptions.Item>
                      <Descriptions.Item label="题目索引号"><Tag>{item.id}</Tag></Descriptions.Item>
                      <Descriptions.Item label={"操作"}><Button size='small' icon={<DeleteOutlined />} onClick={() => {this.removeOne(item)}}>移除</Button></Descriptions.Item>
                    </Descriptions>
                  </Collapse.Panel>
                )
              })
            }
          </Collapse>
          {this.props.testPaperGenList.length === 0 ? myEmptyStatus() : null}
        </Drawer>
      </div>
    )
  }
}
function mapStateToProps({ questionGenerator }) {
  const { testPaperGenList } = questionGenerator;
  return { testPaperGenList };
}


export default connect(mapStateToProps)(RenderDrawer);
