import * as rqs from '../services/requestServices';
import {message} from 'antd';
import { checkCode, isArray } from '../utils/myUtils';

export default {
  namespace: 'loginModel',
  state: {
    isLogin: false,
    username: null,
    user_role: null,
    last_login: null,
    allUser: [],
    applyUser: []
  },
  reducers: {
    isLogin(state, {payload}) {
      return { ...state, isLogin: payload}
    },
    username(state, {payload}) {
      return { ...state, username: payload}
    },
    user_role(state, {payload}) {
      return { ...state, user_role: payload}
    },
    last_login(state, {payload}) {
      return { ...state, last_login: payload}
    },
    allUser(state, {payload}) {
      return { ...state, allUser: payload}
    },
    applyUser(state, {payload}) {
      return { ...state, applyUser: payload}
    }
  },
  effects: {

    *resetLoginStatus({payload}, {call, put}) {
      yield put({ type: 'isLogin', payload: false });
      yield put({ type: 'username', payload: null });
      yield put({ type: 'user_role', payload: null });
      yield put({ type: 'last_login', payload: null });
    },

    *getLoginStatus({payload}, {call, put}) {
      try {
        const res = yield call(rqs.getLoginStatus);
        if (res.code === 200) {
          yield put({ type: 'isLogin', payload: true });
          yield put({ type: 'username', payload: res.data.username });
          yield put({ type: 'user_role', payload: res.data.user_role });
          yield put({ type: 'last_login', payload: res.data.last_login });
        } else {
          yield put({ type: 'resetLoginStatus' });
        }
      } catch (e) {
        console.log(e)
      }
    },

    *login({payload}, {call, put}) {
      try {
        yield put({ type: 'resetLoginStatus' });
        const res = yield call(rqs.login, payload);
        if (checkCode(res)) {
          yield put({ type: 'isLogin', payload: true });
          yield put({ type: 'username', payload: res.data.username });
          yield put({ type: 'user_role', payload: res.data.user_role });
          yield put({ type: 'last_login', payload: res.data.last_login });
        } else if (res.code === 403) {
          message.error("用户名或密码错误", 1);
        }
      } catch (e) {
        console.log(e)
      }
    },

    *logout({payload}, {call, put}) {
      try {
        const resp = yield call(rqs.logout);
        if(checkCode(resp)) {
          message.success('您已退出登陆', 1);
          yield put({type: 'getLoginStatus'})
        }
      } catch (e) {
        console.log(e)
      }
    },

    *registered({payload}, {call, put}) {
      try {
        const res = yield call(rqs.registered, payload);
        if (checkCode(res)) {
          message.success("注册申请已提交", 2)
        } else if (res.code === 500) {
          message.error('用户名已经被使用', 2);
        }
      } catch (e) {
        console.log(e)
      }
    },

    // getAllUser
    *getAllUser({payload}, {call, put}) {
      try {
        const res = yield call(rqs.getAllUser);
        if (checkCode(res) && isArray(res.data)) {
          let tmpList = [];
          res.data.forEach((each, index) => {
            each.key = index;
            tmpList.push(each)
          });
          yield put({ type: 'allUser', payload: tmpList })
        }
      } catch (e) {
        console.log(e)
      }
    },

    // deleteUser
    *deleteUser({payload}, {call, put}) {
      try {
        const res = yield call(rqs.deleteUser, payload);
        if (checkCode(res)) {
          message.success("删除账户成功", 1);
          yield put({ type: 'getAllUser' })
        }
      } catch (e) {
        console.log(e)
      }
    },

    *getApplyUser({payload}, {call, put}) {
      try {
        const res = yield call(rqs.getApplyUser);
        if (checkCode(res)) {
          message.success("刷新成功", 0.5);
          let tmpList = [];
          res.data.forEach((each, index) => {
            each.key = index;
            tmpList.push(each)
          });
          yield put({ type: 'applyUser', payload: tmpList })
        }
      } catch (e) {
        console.log(e)
      }
    },

    // passApply
    *passApply({payload}, {call, put}) {
      try {
        const res = yield call(rqs.passApply, payload);
        if (checkCode(res)) {
          message.success("批准成功", 1);
          yield put({ type: 'getApplyUser' })
        }
      } catch (e) {
        console.log(e)
      }
    },

    // deleteApply
    *deleteApply({payload}, {call, put}) {
      try {
        const res = yield call(rqs.deleteApply, payload);
        if (checkCode(res)) {
          message.success("删除成功", 1);
          yield put({ type: 'getApplyUser' })
        }
      } catch (e) {
        console.log(e)
      }
    },

  },
  subscriptions: {}
}
