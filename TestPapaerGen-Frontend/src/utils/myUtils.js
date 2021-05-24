import { history } from 'umi';
import {notification, message} from 'antd';

// parse json object to url encode string, order to post data
export function parseParams(data) {
  try {
    let tempArr = [];
    for (let i in data) {
      const key = encodeURIComponent(i);
      const value = encodeURIComponent(data[i]);
      tempArr.push(key + '=' + value);
    }
    return tempArr.join('&');
  } catch (err) {
    return null;
  }
}

// go back login page when login status error
function goBackLoginPage() {
  notification.warning({
    message: '登录信息已失效',
    description: '请重新登录',
    key: 'login status error'
  });
  setTimeout(() => {
    history.push('/')
  }, 1500);
  return false;
}

export function checkCode(data) {
  if (data.code === 200) return true;
  else if(data.code === 403) return goBackLoginPage();
  else return false
}

export function isArray(o){
  return Object.prototype.toString.call(o) === '[object Array]';
}

// This function returns a promise object.
// This promise object will be resolved after the delay ends by setTimeout.
// Calling this function needs to combine async / await to achieve the blocking delay effect.
export const delay = timeoutMS => new Promise((resolve) => {
  setTimeout(resolve, timeoutMS);
});


