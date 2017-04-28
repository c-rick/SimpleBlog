import React from 'react';
import { connect } from 'react-redux';
import { showBlog } from '../actions';
import { Button, Icon, Popconfirm, message, Pagination } from 'antd';
import { Link } from 'react-router-dom';
import UpdateModel from './UpdateModel';
import common from '../common.js';
import Remarkable from 'remarkable';


class List extends React.Component{
  constructor (props) {
    super(props)
    this.state = {
      target: {},
      visible: false,
      nowUser: '58feeee116bfa6733f90dcf7',
      nowPage: 1,
      nowPageList: []
    }
  }

  componentWillMount () {
    let { nowUser } = this.state;
    if (this.props.location.search) {
      const query = this.props.location.search;
      nowUser = query.substring(query.indexOf('=') + 1, query.length);
    }
    this.setState({ nowUser: nowUser });
    fetch(common.base + '/blogLists?id=' + nowUser, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/plain; charset=utf-8'
      }
    }).then(
      (res) => res.json()
      ).then(
        (resJson) => {
          if (resJson.status === 200) {
            this.props.dispatch(showBlog(resJson.result));
          } else {
            message.error(resJson.message);
          }
        }
      ).catch(
        (err) => {
          console.log(err)
          message.error('网络错误')
        }
      )
  }

  updateBlogfn (target) {
    this.setState({ target, visible: true })
  }

  deletConfirm (index, id) {
    let username = this.props.loginInfo.user;
    let allState = this.props.bloglist;
    allState.splice(index, 1)
    fetch(common.base + '/deletBlog', {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: common.changePostBody({
        _id: id
      })
    }).then(
        (res) => res.json()
      ).then(
        (resJson) => {
          if (resJson.status === 204) {
            message.success(resJson.message)
          } else {
            message.error(resJson.message);
          }
        }
      ).catch(
        (err) => {
          console.log(err)
          message.error('网络错误')
        }
      )
    this.props.dispatch(showBlog(allState))
  }

  deletCancel () {
    message.error('删除失败');
  }

  handleCancel (){
    this.setState({ visible: false });
  }

  updateFrom (target) {
    console.log(target)
    let user = this.props.loginInfo.user;
    let oldState = this.props.bloglist;
    let newSate = oldState.map((item) =>
       item._id === target._id ? Object.assign({}, item, target) : item
    )
    fetch(common.base + '/updateBlog', {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: common.changePostBody({
        _id: target._id,
        title: target.title,
        content: target.content,
        time: target.time
      })
    }).then(
        (res) => res.json()
      ).then(
        (resJson) => {
          if (resJson.status === 201) {
            message.success(resJson.message)
          } else {
            message.error(resJson.message);
          }
        }
      ).catch(
        (err) => {
          console.log(err)
          message.error('网络错误')
        }
      )
    this.props.dispatch(showBlog(newSate))
  }

  rawMarkup (content) {
    var md = new Remarkable();
    if (content && content.length > 200){
      content = content.substring(0, 200) + '...';
    }
    var rawMarkup = md.render(content);
    return { __html: rawMarkup };
  }

  changePage (e) {
    this.setState({ nowPage: e })
  }

  render () {
    const listarr = this.props.bloglist;
    const { user, nowUser } = this.props.loginInfo;
    let { nowPage, nowPageList } = this.state;
    nowPageList = listarr !== undefined && listarr.length > 0 ? listarr.slice((parseInt(nowPage - 1) * 8), nowPage * 8) : [];
    return (<div>
        <div className="blog-content">
          <ul className="blog-ul">
          {
          nowPageList.length > 0 ?
          nowPageList.map((item, index) =>
             (<li className='blog-li' key={item._id}>
                  <p className="blog-title">{item.title.length > 10 ? `${item.title.substring(0, 10)}...` : item.title}</p>
                  <div className="list-content"><span dangerouslySetInnerHTML={this.rawMarkup(item.content)} /></div>
                  <p className="blog-time">{item.time}</p>
                  <p className="list-a"><Link to={{ pathname: '/detail', state: { _id: item._id } }}>查看更多<Icon type="double-right" /></Link></p>
                  <div className={user === null || user !== nowUser ? 'blog-btn' : 'blog-btn active'}>
                    <Popconfirm title="确定删除此博客吗?" onConfirm={ () => this.deletConfirm(index, item._id) } onCancel={this.deletCancel} okText="确定" cancelText="取消">
                      <Button ><Icon type="delete" />删除博客</Button>
                    </Popconfirm>
                    &emsp;
                    <Button onClick={() => this.updateBlogfn(item) }><Icon type="sync" />更新博客</Button>
                  </div>
                </li>)
            )
          :
          <p className="empty-list">--------------------暂时没有博文------------------------</p>
          }
          </ul>
          <Pagination className={listarr.length > 0 ? 'showPag' : 'hiddenPag'} defaultCurrent={nowPage} defaultPageSize={8} total={listarr.length} onChange={this.changePage.bind(this)} />
          <UpdateModel
            visible={this.state.visible}
            onCancel={this.handleCancel.bind(this)}
            updateFrom={this.updateFrom.bind(this)}
            target={this.state.target}
          />
          </div>
          </div>);
  }
}

function blogProps (state) {
  return { bloglist: state.blogReducer, loginInfo: state.loginReducer }
}

export default connect(blogProps)(List)
