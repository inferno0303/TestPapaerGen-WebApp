import * as requestService from '../services/requestServices';
import { checkCode, isArray } from '../utils/myUtils';
import { message } from 'antd';

export default {
  namespace: 'questionGenHistory',
  state: {
    testPaperGenHistories: [],
    testPaperReportQuestionList: [],
    // 当前报告的难度
    reportDifficulty: 0
  },
  reducers: {
    testPaperGenHistories(state, {payload}) {
      return { ...state, testPaperGenHistories: payload}
    },
    testPaperReportQuestionList(state, {payload}) {
      return { ...state, testPaperReportQuestionList: payload}
    },
    reportDifficulty(state, {payload}) {
      return { ...state, reportDifficulty: payload}
    }
  },
  effects: {

    *getAllTestPaperGenHistory({payload}, {call, put}) {
      try {
        const res = yield call(requestService.getAllTestPaperGenHistory);
        if(checkCode(res) && isArray(res.data)) {
          let tmpList = [];
          res.data.forEach((each, index) => {
            each.key = index;
            tmpList.push(each)
          });
          yield put({ type: 'testPaperGenHistories', payload: tmpList });
        }
      } catch (e) {
        console.log(e)
      }
    },

    *getQuestionGenHistoriesByTestPaperUid({payload}, {call, put}) {
      try {
        const res = yield call(requestService.getQuestionGenHistoriesByTestPaperUid, payload);
        if(checkCode(res) && isArray(res.data)) {
          yield put({ type: 'testPaperReportQuestionList', payload: res.data });
        }
      } catch (e) {
        console.log(e)
      }
    },

    *deleteQuestionGenHistoryByTestPaperUid({payload}, {call, put}) {
      try {
        const res = yield call(requestService.deleteQuestionGenHistoryByTestPaperUid,payload);
        if(checkCode(res)) {
          yield put({type: 'questionGenHistory/getAllTestPaperGenHistory'});
          message.success("删除记录成功", 1);
        }
      } catch (e) {
        console.log(e)
      }
    }

  },
  subscriptions: {}
}
