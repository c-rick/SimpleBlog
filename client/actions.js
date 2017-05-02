export const Show_Blog = 'Show_Blog';
export const Log_In = 'Log_In';
export const Log_Out = 'Log_Out';
export const Change_Now = 'Change_Now';
import common from './common.js';
import { message } from 'antd';


export function showBlog (blogs){
  return {
    type: Show_Blog,
    blogs
  }
}
export function selectBlogAction (user){
  return (dispatch) => {
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
      if (resJson.status === 200) {
        dispatch(showBlog(resJson.result));
      } else {
        message.error(resJson.message);
      }
    }
  ).catch(
    (err) => console.log(err)
  )
  }
}
export function addBlogAction (blogs, user, nowUser){
  return (dispatch) => {
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
          if (resJson.status === 201) {
            message.success(resJson.message)
            if (user === nowUser) {
              dispatch(selectBlogAction(user))
            }
          } else {
            message.error(resJson.message);
          }
        }
      ).catch(
        (err) => console.log(err)
      )
  }
}
export function deletBlogAction (blogid, user){
  return (dispatch) => {
    fetch(common.base + '/deletBlog', {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: common.changePostBody({
        _id: blogid
      })
    }).then(
        (res) => res.json()
      ).then(
        (resJson) => {
          if (resJson.status === 204) {
            message.success(resJson.message)
            dispatch(selectBlogAction(user))
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
}
export function updateBlogAction (target, user) {
  return (dispatch) => {
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
            dispatch(selectBlogAction(user))
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
}
export function changeNow (nowname){
  return {
    type: Change_Now,
    nowname
  }
}
export function login (name, nowname){
  return {
    type: Log_In,
    name,
    nowname
  }
}
export function logout (){
  return {
    type: Log_Out
  }
}
