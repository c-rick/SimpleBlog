export const Show_Blog = 'Show_Blog';
export const Log_In = 'Log_In';
export const Log_Out = 'Log_Out';
export const Rigest_In = 'Rigest_In';
export const Change_Now = 'Change_Now';

export function showBlog (blogs){
  return {
    type: Show_Blog,
    blogs
  }
}

export function rigestIn (name, nowname){
  return {
    type: Rigest_In,
    name,
    nowname
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
