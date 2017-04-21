import React from 'react';
import {connect} from 'react-redux';
import {showBlog} from '../actions';
import { Button, Icon, Popconfirm, message, Pagination} from 'antd';
import {Link} from 'react-router-dom';
import Header from "../components/header";
import BlogUpdateForm from "./updatemodel";
import common from '../common.js';
import Remarkable from 'remarkable';
class Listpage extends React.Component{
	constructor(props){
		super(props)
		this.state={
			target:{}, //传值update
			visible:false,
			nowUser:'rick',
			nowPage:1,
			nowPageList:[]
		}
		
	}
	componentDidMount(){
		let newState=[];
		let {nowUser}=this.state;
		if(this.props.location.search){

					const query=this.props.location.search;
					nowUser=query.substring(query.indexOf('=')+1, query.length);
					newState=common.getLocalDate(nowUser)==null?[]:[...common.getLocalDate(nowUser)];
					
			}else{
				newState=common.getLocalDate(nowUser)==null?[]:[...common.getLocalDate(nowUser)];
			}

		this.props.dispatch(showBlog(newState))
		this.setState({nowUser:nowUser})
	}
	updateBlogfn(target){
		this.setState({target, visible:true})
	}
	deletConfirm(id) {
		let username=this.props.loginInfo.user;
		let oldState=this.props.bloglist;
		let newState=oldState.filter((item)=>item.id!=id);
		common.resetLocalDate(username, newState);
		this.props.dispatch(showBlog(newState))
		message.success('删除成功');
	}
	deletCancel() {
		message.error('删除失败');
	}
	handleCancel(){
		this.setState({ visible: false });
	}
	updateFrom(val){
		let username=this.props.loginInfo.user;		
		let oldState=this.props.bloglist;
		let newSate=oldState.map((item)=>{
			if(item.id==val.id){
				return Object.assign({}, item, val)
			}else{
				return item
			}
		})
		common.resetLocalDate(username, newSate)
		this.props.dispatch(showBlog(newSate))
		message.success("更新成功！")
	}
	rawMarkup(val) {
		var md = new Remarkable();
		if(val&&val.length>200){
			val=val.substring(0, 200)+'...';
		}
		var rawMarkup = md.render(val);
		return { __html: rawMarkup };
	}
	changePage(e){
		this.setState({nowPage:e})
	}
	render(){
		const listarr=this.props.bloglist;
		const {user, nowUser}=this.props.loginInfo;
		let {nowPage, nowPageList}=this.state;
		nowPageList=listarr!=undefined&&listarr.length>0?listarr.filter((item, index)=>index>=(parseInt(nowPage-1)*8)&&index<parseInt(nowPage*8)):[];
		return (<div>
				<div className="B-content">
					<ul className="B-ul">
					{
					nowPageList.length>0?
					nowPageList.map((item)=>{
						return (<li key={item.id}>
									<p className="B-title">{item.title}</p>
									<div className="list-content"><span dangerouslySetInnerHTML={this.rawMarkup(item.content)} /></div>
									<p className="B-time">{item.time}</p>
									<p className="list-a"><Link to={{pathname:'/detail', state:{id:item.id, user:nowUser}}}>查看更多<Icon type="double-right" /></Link></p>
									<div className={user==null||user!=nowUser?"B-btn":"B-btn active"}>
										<Popconfirm title="确定删除此博客吗?" onConfirm={()=>this.deletConfirm(item.id)} onCancel={this.deletCancel} okText="确定" cancelText="取消">
											<Button ><Icon type="delete" />删除博客</Button>
										</Popconfirm>
										&emsp;
										<Button onClick={()=>this.updateBlogfn(item)}><Icon type="sync" />更新博客</Button>
									</div>
								</li>)
						})
					:
					<p className="empty-list">--------------------暂时没有博文------------------------</p>
					}
					
					</ul>
					<Pagination defaultCurrent={nowPage} defaultPageSize={8} total={listarr.length} onChange={this.changePage.bind(this)} />
					<BlogUpdateForm 
					visible={this.state.visible}
					onCancel={this.handleCancel.bind(this)}
					updateFrom={this.updateFrom.bind(this)}
					target={this.state.target}
					/>
					</div>
					</div>);
	}
}
function blogProps(state) {
  return {  bloglist:state.blogReducer, loginInfo:state.loginReducer }
}

export default connect(blogProps)(Listpage)