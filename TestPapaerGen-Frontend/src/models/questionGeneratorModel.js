import { message } from 'antd';
import * as requestService from '../services/requestServices';
import { checkCode, isArray } from '../utils/myUtils';

export default {
  namespace: 'questionGenerator',
  state: {
    flag: 'hello world',
    testPaperGenList: [],
    TKTList: [],
    PDTList: [],
    JDTList: [],
    XZTList: []
  },
  reducers: {
    // 手动选择的题目
    testPaperGenList(state, {payload}) {
      return { ...state, testPaperGenList: payload}
    },
    TKTList(state, {payload}) {
      return { ...state, TKTList: payload}
    },
    PDTList(state, {payload}) {
      return { ...state, PDTList: payload}
    },
    JDTList(state, {payload}) {
      return { ...state, JDTList: payload}
    },
    XZTList(state, {payload}) {
      return { ...state, XZTList: payload}
    }
  },
  effects: {
    addTestPaperGenList: function* ({payload}, {select, put}) {
      const testPaperGenList = yield select(state => state.questionGenerator.testPaperGenList);
      if(!testPaperGenList.includes(payload)) {
        message.success("添加成功");
        yield put({type: 'testPaperGenList', payload: [...testPaperGenList, payload]})
      } else {
        message.warning("冗余")
      }
    },
    removeTestPaperGenList: function* ({payload}, {select, put}) {
      const testPaperGenList = yield select(state => state.questionGenerator.testPaperGenList);
      if(!testPaperGenList.includes(payload)) {
        message.warning("不在组卷列表");
      } else {
        message.success("已移出组卷列表");
        yield put({type: 'testPaperGenList', payload: testPaperGenList.filter(item => {return item !== payload})})
      }
    },
    removeAllTestPaperGenList: function* ({payload}, {put}) {
      yield put({type: 'testPaperGenList', payload: []})
    },
    // 随机出题
    randomSelect: function* ({payload}, {select, call, put}) {
      try{
        const res = yield call(requestService.randomSelect, payload);
        if (checkCode(res)) {
          yield put({type: 'TKTList', payload: res.data.TKTList});
          yield put({type: 'PDTList', payload: res.data.PDTList});
          yield put({type: 'JDTList', payload: res.data.JDTList});
          yield put({type: 'XZTList', payload: res.data.XZTList});
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 生成试卷
    questionGen: function* ({payload}, {select, call, put}) {
      try {
        // postBody
        let postPayload = {};
        // 手动选择的题目Ids
        const testPaperGenList = yield select(state => state.questionGenerator.testPaperGenList);
        let questionIdList = [];
        isArray(testPaperGenList) ? testPaperGenList.forEach(item => {questionIdList.push(item.id)}) : null;
        postPayload["questionIdList"] = questionIdList;
        postPayload["testPaperName"] = payload.testPaperName;
        postPayload["TKTIdList"] = [];
        postPayload["XZTIdList"] = [];
        postPayload["PDTIdList"] = [];
        postPayload["JDTIdList"] = [];
        if (payload.randomSwitch) {
          // 填空题Ids
          const TKTList = yield select(state => state.questionGenerator.TKTList);
          let TKTIdList = [];
          isArray(TKTList) ? TKTList.forEach(item => {TKTIdList.push(item.id)}) : null;
          postPayload["TKTIdList"] = TKTIdList;
          // 选择题Ids
          const XZTList = yield select(state => state.questionGenerator.XZTList);
          let XZTIdList = [];
          isArray(XZTList) ? XZTList.forEach(item => {XZTIdList.push(item.id)}) : null;
          postPayload["XZTIdList"] = XZTIdList;
          // 判断题Ids
          const PDTList = yield select(state => state.questionGenerator.PDTList);
          let PDTIdList = [];
          isArray(PDTList) ? PDTList.forEach(item => {PDTIdList.push(item.id)}) : null;
          postPayload["PDTIdList"] = PDTIdList;
          // 简答题Ids
          const JDTList = yield select(state => state.questionGenerator.JDTList);
          let JDTIdList = [];
          isArray(JDTList) ? JDTList.forEach(item => {JDTIdList.push(item.id)}) : null;
          postPayload["JDTIdList"] = JDTIdList;
        }
        const res = yield call(requestService.questionGen, postPayload);
        if (checkCode(res)) {
          message.success("成功", 1);
          yield call(requestService.downloadFile);
        }
      } catch (e) {
        console.log(e)
      }
    }
  },
  subscriptions: {}
}
