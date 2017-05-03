import React from 'react';
import { connect } from 'react-redux';
import { selectBlogAction, deletBlogAction, updateBlogAction } from '../actions';
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
    this.props.dispatch(selectBlogAction(nowUser))
  }

  updateBlogfn (target) {
    this.setState({ target, visible: true })
  }

  deletConfirm (blogid) {
    let user = this.props.loginInfo.user;
    this.props.dispatch(deletBlogAction(blogid, user))
  }

  deletCancel () {
    message.error('删除失败');
  }

  handleCancel (){
    this.setState({ visible: false });
  }

  updateFrom (target) {
    let user = this.props.loginInfo.user;
    this.props.dispatch(updateBlogAction(target, user))
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
    return (
      <div>
        <div className="blog-content">
          <ul className="blog-ul">
            {
            nowPageList.length > 0 ?
            nowPageList.map((item, index) =>
              (
                <li className='blog-li' key={item._id}>
                  <p className="blog-title">{item.title.length > 10 ? `${item.title.substring(0, 10)}...` : item.title}</p>
                  <div className="list-content">
                    <span dangerouslySetInnerHTML={this.rawMarkup(item.content)} />
                  </div>
                  <p className="blog-time">{item.time}</p>
                  <p className="list-a">
                    <Link to={{ pathname: '/detail', state: { _id: item._id } }}>查看更多<Icon type="double-right" /></Link>
                  </p>
                  <div className={user === null || user !== nowUser ? 'blog-btn' : 'blog-btn active'}>
                    <Popconfirm
                      title="确定删除此博客吗?"
                      okText="确定"
                      cancelText="取消"
                      onConfirm={ () => this.deletConfirm(item._id) }
                      onCancel={this.deletCancel}
                    >
                      <Button ><Icon type="delete" />删除博客</Button>
                    </Popconfirm>
                    &emsp;
                    <Button onClick={() => this.updateBlogfn(item) }><Icon type="sync" />更新博客</Button>
                  </div>
                </li>
              )
            )
            :
            <p className="empty-list">--------------------暂时没有博文------------------------</p>
            }
          </ul>
          <Pagination
            className={listarr.length > 0 ? 'showPag' : 'hiddenPag'}
            defaultCurrent={nowPage}
            defaultPageSize={8}
            total={listarr.length}
            onChange={this.changePage.bind(this)}
          />
          <UpdateModel
            visible={this.state.visible}
            onCancel={this.handleCancel.bind(this)}
            updateFrom={this.updateFrom.bind(this)}
            target={this.state.target}
          />
        </div>
      </div>
    );
  }
}

function blogProps (state) {
  return { bloglist: state.blogReducer, loginInfo: state.loginReducer }
}

export default connect(blogProps)(List)
