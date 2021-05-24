import React from 'react';
import { connect, history } from 'umi';
import { Alert, Button, Form, Input, Radio, Modal, Select, InputNumber, DatePicker, message, Popover } from 'antd';
import { LockOutlined, LoginOutlined, UserOutlined } from '@ant-design/icons';
import styles from './index.less';
import moment from 'moment';

class RegisteredModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  formRef = React.createRef();

  // handle
  onOk = async () => {
    this.formRef.current.validateFields()
      .then(async values => {
        if (values['password'] !== values['password2']) {
          message.warning('两次输入的密码不一致', 1);
          return
        }
        const payload = {
          username: values['username'],
          password: values['password'],
          user_role: 'user'
        };
        this.props.dispatch({ type: 'loginModel/registered', payload: payload });
        await this.props.hide();
      })
      .catch(errorInfo => {
        console.log(errorInfo)
      });
  };

  onCancel = async () => {
    this.props.hide()
  };


  render() {
    return <div>
      <Modal
        title="注册申请"
        centered={true}
        visible={this.props.visible}
        onOk={this.onOk}
        onCancel={this.onCancel}
        okText={"确定"}
        cancelText={"取消"}
      >
        <Form
          labelCol={{span: 6}}
          wrapperCol={{span: 16}}
          ref={this.formRef}
          name="control-ref"
          initialValues={{
            user_role: 'user'
          }}
        >

          <Form.Item
            label="教工编号"
            name="username"
            rules={[{ required: true, message: '验证您信息的真实性' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input type={'password'} />
          </Form.Item>

          <Form.Item
            label="确认密码"
            name="password2"
            rules={[{ required: true, message: '请确认密码' }]}
          >
            <Input type={'password'} />
          </Form.Item>

        </Form>
      </Modal>

    </div>
  }
}

export default RegisteredModal;
