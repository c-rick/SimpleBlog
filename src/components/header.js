import React from 'react';
import {connect} from 'react-redux';
import { showBlog, login, logout, rigestIn, changeNow} from '../actions';
import {Redirect, BrowserRouter} from 'react-router-dom';
import { Button, Menu, Dropdown, Icon, message } from 'antd';
import BlogCreateForm from "./addmodel";
import LoginForm from "./loginmodel";
import common from '../common.js';
import createHistory from 'history/createBrowserHistory'
const history = createHistory();

 class Header extends React.Component{
	constructor(props){
		super(props)
		this.state={
			addvisible: false,
			loginvisible:false,
			modeltype:'login'
		}
		
	}
	componentDidMount(){
		let user=common.getLocalDate('loginInfo')==null?null:common.getLocalDate('loginInfo').user;
		if(user!==null){
			if(history.location.search){
				const query=history.location.search;
				let nowUser=query.substring(query.indexOf('=')+1, query.length);
				this.props.dispatch(login(user, nowUser))
				this.props.dispatch(changeNow(nowUser))
			}else{
				this.props.dispatch(login(user, 'rick'))
			}
			
		}
		// // 监听当前的地址变换
		// if(history.location.pathname=="/"){
		// 	history.push('home?id=rick')
		// 	console.log(history)
		// }
		
		history.listen(location => {
			const query=location.search||location.state;
			if(query!=''&&query!=undefined){
			let user=query.substring(query.indexOf('=')+1, query.length)
			this.props.dispatch(changeNow(user))
			let newState=common.getLocalDate(user)==null?[]:[...common.getLocalDate(user)];
			this.props.dispatch(showBlog(newState));
		}
		})
		}
	menuClick(e){
		let user;
		common.getLocalDate('loginInfo')?
			user=common.getLocalDate('loginInfo').user:user=''
		
		
		switch(e.key){
			case '1':this.showModal(1);break;
			case '2':(()=>{
						history.push({
							pathname: '/list',
							search: '?id='+user,
						});
					})();break;
			case '3':(()=>{
						this.props.dispatch(logout());
						common.resetLocalDate('loginInfo', {user:null});
					})();break;
			case '4':(()=>{this.setState({modeltype:'login'});this.showModal(4)})();break;
			case '5':(()=>{this.setState({modeltype:'redigest'});this.showModal(4)})();break;
			default: alert("debug");break;
		}
	}
	showModal(key){
		key==4?this.setState({ loginvisible: true }):this.setState({ addvisible: true });
	}
	addCancel(){
		this.setState({ addvisible: false });
	}
	loginCancel(){
		this.setState({ loginvisible: false });
	}
	getFrom(val){
		const {user, nowUser}=this.props.loginInfo;
		let newState=this.props.bloglist;
		let changeState=common.getLocalDate(user)==null?[]:common.getLocalDate(user);
		common.resetLocalDate(user, [...changeState, val])
		newState=user==nowUser?[...changeState, val]:newState;
		this.props.dispatch(showBlog(newState))
		message.success("写博成功！")
	}
	loginForm(val){
		const query=history.location.search;
		let user=query.substring(query.indexOf('=')+1, query.length)
		common.resetLocalDate('loginInfo', {user:val, nowUser:user})
		this.props.dispatch(login(val, user))
	}
	render(){
		const {user}=this.props.loginInfo;
		const menu = 
		user!==null?
		<Menu className="font3" onClick={this.menuClick.bind(this)}>
		<Menu.Item key="1">写博客</Menu.Item>
		<Menu.Item key="2">我的博客</Menu.Item>
		<Menu.Item key="3">退出</Menu.Item>
		</Menu>
		:
		<Menu className="font3" onClick={this.menuClick.bind(this)}>
		<Menu.Item key="4">请登录</Menu.Item>
		<Menu.Item key="5">没有帐号？</Menu.Item>
		</Menu>
		;
		return (<div className="B-header">
			<p>欢迎来到万花博客</p>	
			<Dropdown  overlay={menu}>
			<Button className="header-more">
			更多 <Icon type="setting" />
			</Button>
			</Dropdown>
			<BlogCreateForm
			visible={this.state.addvisible}
			onCancel={this.addCancel.bind(this)}
			getFrom={this.getFrom.bind(this)}
			/>
			<LoginForm
			modeltype={this.state.modeltype}
			visible={this.state.loginvisible}
			onCancel={this.loginCancel.bind(this)}
			loginForm={this.loginForm.bind(this)}
			/>
			{ history.location.pathname=="/" ? <Redirect to="/list" /> : '' }
			</div>);
	}
}

function blogProps(state) {
  return {  bloglist:state.blogReducer, loginInfo:state.loginReducer }
}

export default connect(blogProps)(Header)