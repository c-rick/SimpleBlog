import React from 'react';
import {Breadcrumb, Icon, Button} from 'antd';
import Header from "../components/header";
import common from '../common.js';
import Remarkable from 'remarkable';
import {connect} from 'react-redux';
import {showBlog} from '../actions';
 class BlogDetail extends React.Component{
	constructor(props){
		super(props)
		this.state={
			id:'',
			title:'',
			content:'',
			time:'',
			textareaVal:'',
		}
	}
	componentDidMount(){
		let target=this.props.location.state;
		let blog=common.selectLocalDate(target.user, target.id);
		this.setState(blog[0]);

	}
	rawMarkup() {
		var md = new Remarkable();
		var rawMarkup = md.render(this.state.content.toString());
		return { __html: rawMarkup };
	}
	sendComment(){
		let target=this.props.location.state;
		let blog=common.selectLocalDate(target.user, target.id);
		let newState=common.getLocalDate(target.user);
		let {textareaVal}=this.state;
		let {user}=this.props.loginInfo;
		let id=new Date().getTime();
		let time=common.changeDate(id);
		blog[0].commentArr=blog[0].commentArr&&user!=null?[...blog[0].commentArr, {id, name:user, comment:textareaVal, time}]:blog[0].commentArr=[{id, name:user, comment:textareaVal, time}];
		this.setState(blog[0]);
		newState=newState.map((item)=>{
			if(item.id==blog[0].id){
				return Object.assign({}, item, blog[0])
			}else{
				return item
			}
		})
		common.resetLocalDate(target.user, newState)
		this.props.dispatch(showBlog(newState))
	}
	changeVal(event){
		this.setState({textareaVal: event.target.value});
	}
	render(){
		const {title, time, commentArr}=this.state;
		let user=this.props.loginInfo.user;
		return (<div>
				<div className="B-content">
					<div className="blog-box">
					<Breadcrumb>
					<Breadcrumb.Item href="javascript:history.go(-1)">
					<Icon type="home" />
					</Breadcrumb.Item>
					<Breadcrumb.Item>
					博客详情
					</Breadcrumb.Item>
					</Breadcrumb>
						<h3 className="D-title">{title} <i>{time}</i></h3>
						<div className="blog-content" ><span dangerouslySetInnerHTML={this.rawMarkup()} /></div>
						{
							user!=""&&user!=null? (
								<div className="blog-comment">
								<textarea onChange={this.changeVal.bind(this)} />
								<Button onClick={this.sendComment.bind(this)}>确认发送</Button>
								<ul>
								{	
									commentArr!=null&&commentArr.length>0?
									commentArr.map((item, index)=>{
										return (
											<li key={item.id}>
											<span>{item.name}</span>
											<p>{item.comment}</p>
											<span>{item.time}</span>
											</li>
											)
									})
									:
									<li>-------------暂时没有评论---------</li>
								}
								</ul>
								</div>)
								:
								<li className="unLogin-info">-------------登陆参与评论评论---------</li>
						}
						</div>
				</div>
				</div>);
	}
}

function blogProps(state) {
  return {  bloglist:state.blogReducer, loginInfo:state.loginReducer }
}

export default connect(blogProps)(BlogDetail)