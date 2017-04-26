import React from 'react';
import { connect } from 'react-redux';
import { showBlog, login, logout, rigestIn, changeNow } from '../actions';
import { Redirect, BrowserRouter } from 'react-router-dom';
import { Button, Menu, Dropdown, Icon, message } from 'antd';
import AddModel from './AddModel';
import LoginModel from './LoginModel';
import common from '../common.js';
import createHistory from 'history/createBrowserHistory';


const history = createHistory();
class Header extends React.Component{
  constructor (props) {
    super(props)
    this.state = {
      addvisible: false,
      loginvisible: false,
      modeltype: 'login'
    }
  }

  componentDidMount () {
    let user = common.getLocalDate('loginInfo').user || null;
    if (user !== null) {
      if (history.location.search){
        const query = history.location.search;
        let nowUser = query.substring(query.indexOf('=') + 1, query.length);
        this.props.dispatch(login(user, nowUser))
        common.resetLocalDate('loginInfo', { user, nowUser })
      } else {
        this.props.dispatch(login(user, 'rick'))
      }
    }
		// 监听当前的地址变换
    history.listen((location) => {
      const query = location.search || location.state;
      if (query !== '' && query !== undefined) {
        let user = query.substring(query.indexOf('=') + 1, query.length)
        this.props.dispatch(changeNow(user))
        fetch(common.base + '/blogLists?id=' + user, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'text/plain; charset=utf-8'
          }
        }).then(
          (res) => res.json()
        ).then(
          (resJson) => {
            console.log(resJson)
            if (resJson.status === 200) {
              this.props.dispatch(showBlog(resJson.result));
            } else {
              message.error(resJson.message);
            }
          }
        ).catch(
          (err) => console.log(err)
        )
      }
    })
  }

  menuClick (e) {
    let user = common.getLocalDate('loginInfo').user || '';
    switch (e.key) {
      case 'isAdd':this.showModal('isAdd');break;
      case 'isShow': (() => {
        history.push({
          pathname: '/list',
          search: '?id=' + user
        });
      })();
        break;
      case 'isLoginOut': (() => {
        this.props.dispatch(logout());
        common.resetLocalDate('loginInfo', { user: null });
      })();
        break;
      case 'isLogin': (() => {
        this.setState({ modeltype: 'login' });
        this.showModal('isLogin')
      })();
        break;
      case 'isRigestIn': (() => {
        this.setState({ modeltype: 'redigest' });
        this.showModal('isLogin')
      })();
        break;
      default: alert('debug');break;
    }
  }
  showModal (key) {
    key === 'isLogin' ? this.setState({ loginvisible: true }) : this.setState({ addvisible: true });
  }
  addCancel () {
    this.setState({ addvisible: false });
  }

  loginCancel () {
    this.setState({ loginvisible: false });
  }
  addBlog (blogs) {
    const { user, nowUser } = this.props.loginInfo;

    // 判断是否当前用户博文列表
    if (user === nowUser) {
      fetch(common.base + '/blogLists?id=' + user, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'text/plain; charset=utf-8'
        }
      }).then(
        (res) => res.json()
      ).then(
        (resJson) => {
          console.log(resJson)
          if (resJson.status === 200) {
            let newState = [...resJson.result, blogs];
            this.props.dispatch(showBlog(newState));
          } else {
            message.error(resJson.message);
          }
        }
      ).catch(
        (err) => console.log(err)
      )
    }
    fetch(common.base + '/addBlog', {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: common.changePostBody({
        userid: user,
        title: blogs.title,
        content: blogs.content,
        time: blogs.time
      })
    }).then(
        (res) => res.json()
      ).then(
        (resJson) => {
          console.log(resJson)
          if (resJson.status === 201) {
            message.success(resJson.message)
          } else {
            message.error(resJson.message);
          }
        }
      ).catch(
        (err) => console.log(err)
      )
  }
  loginForm (userName) {
    const query = history.location.search;
    let nowUser = query.substring(query.indexOf('=') + 1, query.length)
    common.resetLocalDate('loginInfo', { user: userName, nowUser: nowUser })
    this.props.dispatch(login(userName, nowUser))
  }
  render (){
    const { user } = this.props.loginInfo;
    const menu = user !== null ?
		<Menu className="font3" onClick={this.menuClick.bind(this)}>
		<Menu.Item key="isAdd">写博客</Menu.Item>
		<Menu.Item key="isShow">我的博客</Menu.Item>
		<Menu.Item key="isLoginOut">退出</Menu.Item>
		</Menu>
		:
		<Menu className="font3" onClick={this.menuClick.bind(this)}>
		<Menu.Item key="isLogin">请登录</Menu.Item>
		<Menu.Item key="isRigestIn">没有帐号？</Menu.Item>
		</Menu>
		;
    return (<div className="blog-header">
							<p>欢迎来到万花博客</p>
							<Dropdown overlay={menu}>
							<Button className="header-more">
							更多 <Icon type="setting" />
							</Button>
							</Dropdown>
							<AddModel
								visible={this.state.addvisible}
								onCancel={this.addCancel.bind(this)}
								getFrom={this.addBlog.bind(this)}
							/>
							<LoginModel
								modeltype={this.state.modeltype}
								visible={this.state.loginvisible}
								onCancel={this.loginCancel.bind(this)}
								loginForm={this.loginForm.bind(this)}
							/>
							{ history.location.pathname === '/' ? <Redirect to="/list" /> : '' }
						</div>);
  }
}

function blogProps (state) {
  return { bloglist: state.blogReducer, loginInfo: state.loginReducer }
}

export default connect(blogProps)(Header)
