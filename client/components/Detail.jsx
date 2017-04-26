import React from 'react';
import { Breadcrumb, Icon, Button } from 'antd';
import common from '../common.js';
import Remarkable from 'remarkable';
import { connect } from 'react-redux';
import { showBlog } from '../actions';



class Detail extends React.Component{
  constructor (props){
    super(props)
    this.state = {
      _id: '',
      title: '',
      content: '',
      time: '',
      textareaVal: '',
      commentArr: []
    }
  }
  componentDidMount () {
    let target = this.props.location.state;
    fetch(common.base + '/blogDetail?_id=' + target._id, {
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
            this.setState(
              resJson.result[0]
            );
          } else {
            message.error(resJson.message);
          }
        }
      ).catch(
        (err) => console.log(err)
      )
    this.getComments();
  }

  getComments () {
    let target = this.props.location.state;
    fetch(common.base + '/comments?blogid=' + target._id, {
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
            this.setState({ commentArr: resJson.result });
          } else {
            message.error(resJson.message);
          }
        }
      ).catch(
        (err) => console.log(err)
      )
  }
  rawMarkup () {
    var md = new Remarkable();
    var rawMarkup = md.render(this.state.content.toString());
    return { __html: rawMarkup };
  }
  sendComment () {
    const username = common.getLocalDate('username');
    let target = this.props.location.state;
    let { textareaVal, commentArr } = this.state;
    let time = common.changeDate(new Date().getTime());
    let newCommon = {
      blogid: target._id,
      user: username,
      comment: textareaVal,
      time: time
    };
    fetch(common.base + '/addComment', {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: common.changePostBody(newCommon)
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
    (err) => console.log(err)
    )
    this.getComments();
  }
  changeVal (event) {
    this.setState({ textareaVal: event.target.value });
  }
  render () {
    const { title, time, commentArr } = this.state;
    let user = this.props.loginInfo.user;
    return (
    <div>
      <div className="blog-content">
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
              user !== '' && user !== null ? (
                <div className="blog-comment">
                  <textarea onChange={this.changeVal.bind(this)} />
                  <Button onClick={this.sendComment.bind(this)}>确认发送</Button>
                  <ul>
                  {
                    commentArr !== undefined && commentArr.length > 0 ?
                    commentArr.map((item, index) =>
                       (
                             <li key={item._id}>
                              <span>{item.user}</span>
                              <div>{item.comment}</div>
                              <span>{item.time}</span>
                            </li>
                        )
                      )
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


function blogProps (state) {
  return { bloglist: state.blogReducer, loginInfo: state.loginReducer }
}

export default connect(blogProps)(Detail)
