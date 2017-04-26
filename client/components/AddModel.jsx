import React from 'react';
import { Button, Modal, Form, Input } from 'antd';
import common from '../common.js';


const FormItem = Form.Item;
class addmodel extends React.Component{
  constructor (props){
    super(props)
  }
  handleCreate (){
    const form = this.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const timeString = new Date().getTime();
      values.id = timeString;
      values.time = common.changeDate(timeString);
      form.resetFields();
      this.setState({ visible: false });
      this.props.onCancel();
      this.props.getFrom(values);
    });
  }
  OnclearCancel () {
    const form = this.props.form;
    form.resetFields();
    this.props.onCancel()
  }
  render (){
    const { visible, onCancel } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (<Modal
			visible={visible}
			title="编写新博客"
			okText="保存"
			onCancel={this.OnclearCancel.bind(this)}
			onOk={this.handleCreate.bind(this)}
			>
             <Form layout="vertical">
				<FormItem label="标题">
				{getFieldDecorator('title', { rules: [{ required: true, message: '请输入博客标题!' }] })(
					<Input />
				)}
				</FormItem>
				<FormItem label="内容">
				{getFieldDecorator('content', { rules: [{ required: true, message: '写点啥吧!' }] })(<Input rows="10" type="textarea" />)}
				</FormItem>
			</Form>
		</Modal>);
  }
}

export default Form.create()(addmodel);
