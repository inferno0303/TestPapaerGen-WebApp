import * as requestService from '../services/requestServices';
import { checkCode, isArray } from '../utils/myUtils';
import { message } from 'antd';

export default {
  namespace: 'questionBank',
  state: {
    tableDataSource: [],
    eachChapterCount: null,
    eachScoreCount: null
  },
  reducers: {
    tableDataSource(state, {payload}) {
      return { ...state, tableDataSource: payload}
    },
    eachChapterCount(state, {payload}) {
      return { ...state, eachChapterCount: payload}
    },
    eachScoreCount(state, {payload}) {
      return { ...state, eachScoreCount: payload}
    }
  },
  effects: {
    *getQuestionBank({payload}, {call, put}) {
      try {
        const res = yield call(requestService.getQuestionBank);
        if(checkCode(res) && isArray(res.data)) {
          let tmpList = [];
          res.data.forEach((each, index) => {
            each.key = index;
            tmpList.push(each)
          });
          yield put({ type: 'tableDataSource', payload: tmpList });
          message.success("获取题库成功", 1)
        }
      } catch (e) {
        console.log(e)
      }
    },
    *deleteSingleQuestionBank({payload}, {call, put}) {
      try {
        const res = yield call(requestService.deleteSingleQuestionBank, payload);
        if (checkCode(res)) {
          message.success("删除成功", 1)
        }
      } catch (e) {
        console.log(e)
      }
    },

    // 统计概览
    *getEachChapterCount({payload}, {call, put}) {
      try {
        const res = yield call(requestService.getEachChapterCount);
        if (checkCode(res) && isArray(res.data)) {
          yield put({ type: 'eachChapterCount', payload: res.data });
        }
      } catch (e) {
        console.log(e)
      }
    },
    *getEachScoreCount({payload}, {call, put}) {
      try {
        const res = yield call(requestService.getEachScoreCount);
        if (checkCode(res) && isArray(res.data)) {
          yield put({ type: 'eachScoreCount', payload: res.data });
        }
      } catch (e) {
        console.log(e)
      }
    }
  },
  subscriptions: {}
}
