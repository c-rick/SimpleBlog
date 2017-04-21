import React from 'react';
import {Breadcrumb, Icon} from 'antd';
import Header from "../components/header";
import common from '../common.js';
import Remarkable from 'remarkable';
export default class BlogDetail extends React.Component{
	constructor(props){
		super(props)
		this.state={
			id:'',
			title:'',
			content:'',
			time:''
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
	render(){
		const {title, content, time}=this.state;
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
					</div>
				</div>
				</div>);
	}
}