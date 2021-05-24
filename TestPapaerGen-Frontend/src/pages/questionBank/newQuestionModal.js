import React from 'react';
import { Modal, Form, Input, Button, Checkbox, Select, InputNumber } from 'antd';
import style from './index.less';

class NewQuestionModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    }
  }

  handleSubmit = value => {
    console.log(value);
    this.props.closeModal()
  };
  handleCancel = () => {
    this.props.closeModal()
  };

  initData = async () => {

  };

  componentDidMount() {
    this.initData().then()
  }

  render() {
    const renderForm = () => {
      return (
        <Form name="basic"
              initialValues={{  }}
              onFinish={this.handleSubmit}
              onFinishFailed={this.handleCancel}
              className={style.margin_30}
        >
          <Form.Item
            label="题目内容"
            name="topic"
            rules={[{ required: true, message: '请输入题目' }]}
          >
            <Input.TextArea autoSize={{ minRows: 3, maxRows: 15 }} />
          </Form.Item>

          <Form.Item
            label="题目材料"
            name="topic_material"
            rules={[{ required: false, message: '请输入题目材料' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="参考答案"
            name="answer"
            rules={[{ required: true, message: '请输入答案' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="topic_type" label="题目类型" rules={[{ required: true }]}>
            <Select placeholder="请选择一个题目类型" allowClear>
              <Select.Option value="选择题">选择题</Select.Option>
              <Select.Option value="填空题">填空题</Select.Option>
              <Select.Option value="简答题">简答题</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="分值"
            name="score"
            rules={[{ required: true, message: '请输入答案' }]}
          >
            <InputNumber min={1} max={10} defaultValue={1} />
          </Form.Item>

          <Form.Item name="chapter_1" label="大章节" rules={[{ required: true }]}>
            <Select placeholder="请选择一个大章节" allowClear>
              <Select.Option value="选择题">选择题</Select.Option>
              <Select.Option value="填空题">填空题</Select.Option>
              <Select.Option value="简答题">简答题</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="chapter_2" label="小章节" rules={[{ required: true }]}>
            <Select placeholder="请选择一个小章节" allowClear>
              <Select.Option value="选择题">选择题</Select.Option>
              <Select.Option value="填空题">填空题</Select.Option>
              <Select.Option value="简答题">简答题</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="大知识点标签"
            name="label_1"
            rules={[{ required: true, message: '请输入大知识点标签' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="小知识点标签"
            name="label_2"
            rules={[{ required: true, message: '请输入小知识点标签' }]}
          >
            <Input />
          </Form.Item>


          <Form.Item>
            <Button type="primary" htmlType="submit" className={style.submit_btn}>
              提交
            </Button>
          </Form.Item>
        </Form>
      )
    };

    const renderDispatch = () => {
      return (
        <div style={{maxHeight: '80vh', overflowY: 'scroll'}}>
          { renderForm() }
        </div>
      )
    };

    return <div>
      <Modal
        title="新增题目"
        width={'600px'}
        visible={this.props.visible}
        onCancel={this.handleCancel}
        footer={null}
        afterClose={() => null}
      >
        { renderDispatch() }
      </Modal>
    </div>
  }

}

export default NewQuestionModal;
