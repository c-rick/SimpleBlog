import React from 'react';
import { Button, Modal, Form, Input, message} from 'antd';
import common from '../common.js';
const FormItem = Form.Item;
class loginmodel extends React.Component{
	constructor(props){
		super(props)
	}
	handleCreate(key){
		if(key==1){
			// login
			const form = this.props.form;
			form.validateFields((err, values) => {
				if (err) {
					return;
				}
				form.resetFields();
				this.props.onCancel();
				common.checkUserLogin(values.loginName, values.loginPassword)==true?
				this.props.loginForm(values.loginName, values.loginPassword)
				:
				message.error("账户名或密码错误");
			});
		}else{
			// redigest
			const form = this.props.form;
			form.validateFields((err, values) => {
				if (err!=null&&err.hasOwnProperty('ridigestName')||err!=null&&err.hasOwnProperty('ridigestPassword')) {
					return;
				}
				form.resetFields();
				this.props.onCancel();
				let usesrArr=common.getLocalDate('usesrArr')
				usesrArr=usesrArr==null?{}:usesrArr;
				usesrArr[values.ridigestName]=values.ridigestPassword;
				common.resetLocalDate('usesrArr', usesrArr)
			});
		}

	}
	ridigestIsUser(rule, val, callback){
		setTimeout(()=>{
			common.checkUserRidgest(val)==true?callback():callback('已有人注册');
		}, 1000)

	}
	loginIsUser(rule, val, callback){
		setTimeout(()=>{
			common.checkUserRidgest(val)==true?callback('找不到该用户'):callback();
		}, 1000)
	}
	render(){
		const { visible, onCancel, modeltype } = this.props;
		const { getFieldDecorator } = this.props.form;
		return (<div>
				{
				modeltype=='login'?
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
					rules: [{ required:true, message: '请输入帐号!' },
					{validator:this.loginIsUser}],
				})(
				<Input />
				)}
				</FormItem>
				<FormItem label="密码">
				{getFieldDecorator('loginPassword', {
					rules: [{ required:true, message: '请输入密码!' }],
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
					{validator:this.ridigestIsUser}],
				})(
				<Input />
				)}
				</FormItem>
				<FormItem label="密码">
				{getFieldDecorator('ridigestPassword', {
					rules: [{ required:true, message: '请输入密码!' }],
				})(<Input type="text" />)}
				</FormItem>
				</Form>
				</Modal>
			}
			</div>
			);
	}
}
const modelFrom=Form.create()(loginmodel)
export default modelFrom