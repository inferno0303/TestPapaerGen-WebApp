import * as requestService from '../services/requestServices';
import { checkCode, isArray } from '../utils/myUtils';
import { message } from 'antd';
import { API } from "../config/requestConfig";
import { request } from "umi";

let a = () => {
  return 'ok'
}

function getQuestionList() {
  const url = `${API}/getAllQuestionBank2`;
  return request(url, {
    method: 'get',
    mode: 'cors',
    credentials: 'include'
  })
}

export default {
  namespace: 'questionManager',
  state: {
    questionList: []
  },
  reducers: {
    questionList(state, {payload}) {
      return { ...state, questionList: payload}
    },
  },
  effects: {
    *getQuestionList({payload}, {call, put}) {
      try {
        const res = yield call(getQuestionList);
        if(checkCode(res) && isArray(res.data)) {
          let tmpList = [];
          res.data.forEach((each, index) => {
            each.key = index;
            tmpList.push(each)
          });
          yield put({ type: 'questionList', payload: tmpList });
          message.success("questionList", 1).then(r => null)
        }
      } catch (e) {
        console.log(e)
      }
    },
  },
  subscriptions: {}
}