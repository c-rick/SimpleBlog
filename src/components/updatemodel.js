import React from 'react';
import { Button, Modal, Form, Input, Radio } from 'antd';
import common from '../common.js';
const FormItem = Form.Item;
class updatemodel extends React.Component{
	constructor(props){
		super(props)
		this.state={
			show:false
		}
	}
	handleUpdate(){
		const {form} = this.props;
		form.validateFields((err, values) => {
			if (err) {
				return;
			}
			const timeString=new Date().getTime();
			values.time=common.changeDate(timeString);
			form.resetFields();
			this.setState({ visible: false });
			this.props.onCancel();
			this.props.updateFrom(values);
		});
	}

	render(){
		const { visible, onCancel } = this.props;
		const { getFieldDecorator } = this.props.form;
		const listarr=this.state.listarr;
		return (<Modal
			visible={visible}
			title="更新博客"
			okText="保存"
			onCancel={onCancel}
			onOk={this.handleUpdate.bind(this)}

			>
			<Form layout="vertical" >
			<FormItem >
			{getFieldDecorator('id')(<Input type="hidden" />)}
			</FormItem>
			<FormItem label="标题">
			{getFieldDecorator('title', {
				rules: [{ required: true, message: '请输入博客标题!' }],
			})(
			<Input />
			)}
			</FormItem>
			<FormItem label="内容">
			{getFieldDecorator('content', {
				rules: [{ required: true, message: '写点啥吧!' }],
			})(<Input rows="10" type="textarea" />)}
			</FormItem>
			</Form>
			</Modal>);
	}
}
const modelFrom=Form.create({mapPropsToFields(props) {
	const {form, target} = props;
	return {
			title:{value:target.title},
			content:{value:target.content},
			id:{value:target.id}
		}
    
  }})(updatemodel)
export default modelFrom