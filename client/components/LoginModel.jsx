import React from 'react';
import { Button, Modal, Form, Input, message } from 'antd';
import common from '../common.js';


const FormItem = Form.Item;
class loginmodel extends React.Component{
  constructor (props){
    super(props)
  }

  handleCreate (key) {
    const form = this.props.form;
      // login
    form.validateFields((err, forms) => {
      if (err) {
        return;
      }
      if (key === 1){
        fetch(common.base + '/login', {
          method: 'post',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: common.changePostBody({ name: forms.loginName, pawssword: forms.loginPassword })
        }).then(
          (res) => res.json()
        ).then(
          (resJson) => {
            if (resJson.status === 200) {
              message.success(resJson.message)
              this.props.loginForm(resJson.result[0]._id);
              common.resetLocalDate('username', resJson.result[0].name);
            } else {
              message.error(resJson.message);
            }
          }
        ).catch(
          (err) => console.log(err)
        )
      } else {
        // redigest
        fetch(common.base + '/register', {
          method: 'post',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: common.changePostBody({ name: forms.ridigestName, pawssword: forms.ridigestPassword })
        }).then(
          (res) => res.json()
        ).then(
          (resJson) => {
            resJson.status === 200 ?
              message.success(resJson.message)
              :
              message.error(resJson.message);
          }
        ).catch(
          (err) => console.log(err)
        )
      }
      form.resetFields();
      this.props.onCancel();
    });
  }

  ridigestIsUser (rule, val, callback) {
    fetch(common.base + '/checkuser', {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: common.changePostBody({ name: val })
    }).then(
      (res) => res.json()
    ).then(
      (resJson) => {
        resJson.status === 400 ? callback() : callback('已有人注册') ;
      }
    ).catch(
      (err) => console.log(err)
    )
  }

  loginIsUser (rule, val, callback) {
    fetch(common.base + '/checkuser', {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: val })
    }).then(
      (res) => res.json()
    ).then(
      (resJson) => {
        resJson.status === 400 ? callback('此帐号未注册') : callback() ;
      }
    ).catch(
      (err) => console.log(err)
    )
  }

  render () {
    const { visible, onCancel, modeltype } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (<div>
          {
          modeltype === 'login' ?
          <Modal
            visible={visible}
            title="登录"
            okText="登录"
            onCancel={onCancel}
            onOk={this.handleCreate.bind(this, 1)}
          >
            <Form layout="vertical">
              <FormItem label="帐号" hasFeedback>
              {getFieldDecorator('loginName', {
                rules: [{ required: true, message: '请输入帐号!' },
                { validator: this.loginIsUser }]
              })(
              <Input />
              )}
              </FormItem>
              <FormItem label="密码">
              {getFieldDecorator('loginPassword', {
                rules: [{ required: true, message: '请输入密码!' }]
              })(<Input type="password" />)}
              </FormItem>
            </Form>
          </Modal>
          :
          <Modal
            visible={visible}
            title="注册"
            okText="注册"
            onCancel={onCancel}
            onOk={this.handleCreate.bind(this, 2)}
          >
            <Form layout="vertical">
              <FormItem label="帐号" hasFeedback>
              {getFieldDecorator('ridigestName', {
                rules: [{ required: true, message: '请输入帐号!' },
                { validator: this.ridigestIsUser }]
              })(
              <Input />
              )}
              </FormItem>
              <FormItem label="密码">
              {getFieldDecorator('ridigestPassword', {
                rules: [{ required: true, message: '请输入密码!' }]
              })(<Input type="text" />)}
              </FormItem>
            </Form>
          </Modal>
        }
      </div>
    );
  }
}



export default Form.create()(loginmodel);
