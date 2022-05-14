import React from 'react';
import { connect, history } from "umi";
import {
  Badge,
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Modal,
  PageHeader,
  Radio,
  Select,
  Table,
  Tag,
  Upload
} from "antd";
import { CheckOutlined, FileAddOutlined, PieChartOutlined, CloudUploadOutlined } from "@ant-design/icons";
import * as myUtils from '../../utils/myUtils';
import style from './index.less';
import { renderLoading } from '../../layouts/commonComponents';
import { delay } from '../../utils/myUtils';


class QuestionEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isInsertMode: true,
      formInitialValues: {
        score: 2
      },
      // 导入向导对话框是否显示
      isImportWizardVisible: false,
    }
  }

  // handler
  handleChapter1Onchange = value => {
    this.props.dispatch({type: 'questionEdit/filterChapter2ByChapter1', payload: value});
    this.props.dispatch({type: 'questionEdit/filterLabel1ByChapter1', payload: value});
    this.props.dispatch({type: 'questionEdit/filterLabel2ByChapter1', payload: value});
  };

  handleSubmit = value => {
    if(this.state.isInsertMode) {
      this.props.dispatch({type: 'questionEdit/insertSingleQuestionBank', payload: value})
    } else {
      value.id = this.props.location.query.questionBankId;
      this.props.dispatch({type: 'questionEdit/updateQuestionBankById', payload: value})
    }
  };

  // <状态> 导入excel文件到题库中 对话框 visible
  changeImportWizardVisible = () => {
    this.setState({isImportWizardVisible: !this.state.isImportWizardVisible})
  }


  // initData
  initData = async () => {
    await this.setState({isLoading: true});

    // 判断是新增模式还是修改模式
    // 如果是新增模式
    if (!this.props.location.query?.questionBankId) await this.setState({ isInsertMode: true });
    // 否则是修改模式
    else {
      await this.setState({ isInsertMode: false });
      await this.props.dispatch({type: 'questionEdit/getQuestionBankById', payload: {id: this.props.location.query.questionBankId}});
      // 在修改模式下，给表单赋初始值
      if(this.props.editTarget.length > 0) {
        const questionBank = this.props.editTarget[0];
        await this.setState({
          formInitialValues: {
            topic: questionBank.topic,
            topic_material: questionBank.topic_material,
            answer: questionBank.answer,
            topic_type: questionBank.topic_type,
            score: questionBank.score,
            difficulty: questionBank.difficulty,
            chapter_1: questionBank.chapter_1,
            chapter_2: questionBank.chapter_2,
            label_1: questionBank.label_1,
            label_2: questionBank.label_2
          }
        })
      }
    }

    await this.props.dispatch({type: 'questionEdit/getAllQuestionLabels'});
    await this.setState({isLoading: false});
  };

  // lifeCycle
  componentDidMount() {
    this.initData().then(null);
  }

  render() {

    const renderForm = () => {
      if(this.state.isLoading) return renderLoading('正在加载', '50vh');
      return <div className={style.form_wrapper}>
        <Form name="basic"
              initialValues={this.state.formInitialValues}
              onFinish={this.handleSubmit}
          // onFinishFailed={this.handleCancel}
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              className={style.form}
        >
          <Form.Item
            label="题目内容"
            name="topic"
            rules={[{ required: true, message: '请输入题目内容' }]}
          >
            <Input.TextArea autoSize={{ minRows: 3, maxRows: 15 }} placeholder='请输入题目内容' />
          </Form.Item>
          <Form.Item
            label="参考答案"
            name="answer"
            rules={[{ required: true, message: '请输入答案' }]}
          >
            <Input.TextArea autoSize={{ minRows: 3, maxRows: 15 }} placeholder='请输入参考答案' />
          </Form.Item>

          <Form.Item
            label="难度"
            name="difficulty"
            rules={[{ required: true, message: '请选择题目难度' }]}
          >
            <Select placeholder="请选择题目难度" allowClear>
              <Select.Option value="1">1</Select.Option>
              <Select.Option value="2">2</Select.Option>
              <Select.Option value="3">3</Select.Option>
              <Select.Option value="4">4</Select.Option>
              <Select.Option value="5">5</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="topic_type" label="题目类型" rules={[{ required: true }]}>
            <Select placeholder="请选择题目类型" allowClear>
              <Select.Option value="选择题">选择题</Select.Option>
              <Select.Option value="填空题">填空题</Select.Option>
              <Select.Option value="判断题">判断题</Select.Option>
              <Select.Option value="程序阅读题">程序阅读题</Select.Option>
              <Select.Option value="程序设计题">程序设计题</Select.Option>

            </Select>
          </Form.Item>

          <Form.Item name="score" label="分值" rules={[{ required: true, message: '请输入分值' }]}
          >
            <InputNumber min={1} max={50} style={{width: '100%'}} />
          </Form.Item>

          <Form.Item name="chapter_1" label="大章节" rules={[{ required: true }]}>
            <Select placeholder="请选择一个大章节" onChange={this.handleChapter1Onchange}>
              {
                myUtils.isArray(this.props.chapter1) ? this.props.chapter1.map((item, index) =>
                  <Select.Option key={index} value={item}>{item}</Select.Option>
                ) : null
              }
            </Select>
          </Form.Item>

          <Form.Item name="chapter_2" label="小章节" rules={[{ required: true }]}>
            <Select placeholder="请选择一个小章节">
              {
                myUtils.isArray(this.props.chapter2) ? this.props.chapter2.map((item, index) =>
                  <Select.Option key={index} value={item}>{item}</Select.Option>
                ) : null
              }
            </Select>
          </Form.Item>

          <Form.Item
            label="大知识点标签"
            name="label_1"
            rules={[{ required: true, message: '大知识点标签' }]}
          >
            <Select placeholder="请选择大知识点标签">
              {
                myUtils.isArray(this.props.label1) ? this.props.label1.map((item, index) =>
                  <Select.Option key={index} value={item}>{item}</Select.Option>
                ) : null
              }
            </Select>
          </Form.Item>
          <Form.Item
            label="小知识点标签"
            name="label_2"
            rules={[{ required: true, message: '小知识点标签' }]}
          >
            <Select placeholder="请选择小知识点标签">
              {
                myUtils.isArray(this.props.label2) ? this.props.label2.map((item, index) =>
                  <Select.Option key={index} value={item}>{item}</Select.Option>
                ) : null
              }
            </Select>
          </Form.Item>


          <Form.Item>
            <Button type="primary" htmlType="submit" className={style.submit_btn}>
              提交
            </Button>
          </Form.Item>
        </Form>
      </div>
    };

    return <div>
      <PageHeader title={this.state.isInsertMode ? '添加题目' : '正在修改'}
                  subTitle={'支持题库的增删改'}
                  extra={
                    <Button type="primary"
                            onClick={this.changeImportWizardVisible}
                    >
                      导入excel文件到题库中
                    </Button>
                  }
      />
      {
        renderForm()
      }
      {
        <ImportWizard visible={this.state.isImportWizardVisible}
                      changeVisible={this.changeImportWizardVisible}
                      { ...this.props }
        />
      }
    </div>;
  }
}

function mapStateToProps({ questionEdit }) {
  const { allQuestionLabels, chapter1, chapter2, label1, label2, editTarget } = questionEdit;
  return { allQuestionLabels, chapter1, chapter2, label1, label2, editTarget };
}

export default connect(mapStateToProps)(QuestionEdit);

// <对话框> 导入excel文件到题库中
class ImportWizard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isDeleteAll: false,
      file: null,
      fileList: [],
      uploadBtnLoading: false
    }
  }

  uploadOnChange = async (data) => {
    // 这里画蛇添足是为了解决 antd 的这个问题，so, fu*k antd!
    // https://github.com/ant-design/ant-design/issues/2423
    // 如果需求简单的话，建议用h5原生，不想折腾 upload 组件了，这个轮子不好用
    await this.setState({
      file: null,
      fileList: [],
    });
    await this.setState({
      file: data.file,
      fileList: [data.file]
    });
  }

  uploadFile = async () => {
    await this.setState({uploadBtnLoading: true});
    let formData = new FormData();
    formData.append('file', this.state.file);
    formData.append('isDeleteAll', this.state.isDeleteAll)
    await this.props.dispatch({ type: 'questionEdit/uploadFile', payload: formData });
    await this.setState({uploadBtnLoading: false});
    await this.setState({
      file: null,
      fileList: []
    })
    await this.props.changeVisible();
  }

  render() {
    return (
      <Modal title="导入excel文件到题库中"
             centered={true}
             visible={this.props.visible}
             onCancel={this.props.changeVisible}
             footer={null}
             width={'600px'}
      >
        <div style={{display: "flex", alignItems: "center", justifyContent: "center", margin: "20px auto"}}>
          <Upload name="file"
                  accept=".xlsx"
                  multiple={false}
                  // 这里非常坑，在受控模式+手动上传时，要关闭这个钩子，不然会自动 delete fileList，导致 file 这个引用也会被删除，覆盖后变成 defaultFileList <Object[]>
                  beforeUpload={() => false}
                  fileList={this.state.fileList}
                  showUploadList={false}
                  onChange={this.uploadOnChange}
          >
            <Button type="primary">选择*.xlsx文件</Button>
          </Upload>
          {
            this.state.file != null ?
              <div>已选择了：{this.state.file.name}</div> :
              null
          }
        </div>

        <Checkbox style={{display: "flex", alignItems: "center", justifyContent: "center"}} checked={this.state.isDeleteAll}
                  onChange={e => {this.setState({isDeleteAll: e.target.checked})}}
        >
          是否清空原来的题库？
        </Checkbox>
        <Button style={{display: "block", margin: "20px auto"}}
                icon={<CloudUploadOutlined />}
                type="primary"
                loading={this.state.uploadBtnLoading}
                disabled={this.state.file === null}
                onClick={this.uploadFile}
        >
          确定导入
        </Button>
      </Modal>
    )
  }
}