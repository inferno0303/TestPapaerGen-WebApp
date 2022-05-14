import { message } from 'antd';
import * as requestService from '../services/requestServices';
import { checkCode, isArray } from '../utils/myUtils';
import { geneticSelect } from "../services/requestServices";

export default {
  namespace: 'questionGenerator',
  state: {
    flag: 'hello world',
    testPaperGenList: [],
    TKTList: [],
    PDTList: [],
    JDTList: [],
    XZTList: [],
    // 遗传迭代算法执行过程的方差记录，会越来越小
    variance: []
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
    },
    variance(state, {payload}) {
      return { ...state, variance: payload}
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
    // 清空上次自动组卷数据
    emptyList: function* ({}, {put}) {
      yield put({type: 'TKTList', payload: []});
      yield put({type: 'PDTList', payload: []});
      yield put({type: 'JDTList', payload: []});
      yield put({type: 'XZTList', payload: []});
      yield put({type: 'variance', payload: []});
    },
    // 贪心最优算法
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
    // 遗传迭代算法
    geneticSelect: function* ({payload}, {select, call, put}) {
      try{
        const res = yield call(requestService.geneticSelect, payload);
        if (checkCode(res)) {
          yield put({type: 'TKTList', payload: res.data.TKTList});
          yield put({type: 'PDTList', payload: res.data.PDTList});
          yield put({type: 'JDTList', payload: res.data.JDTList});
          yield put({type: 'XZTList', payload: res.data.XZTList});
          yield put({type: 'variance', payload: res.data.variance});
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
    },
    // 新的生成试卷接口
    questionGen2: function* ({payload}, {select, call, put}) {
      try {
        // postBody
        let postPayload = {};
        // 手动选择的题目Ids
        const testPaperGenList = yield select(state => state.questionGenerator.testPaperGenList);
        let questionIdList = [];
        isArray(testPaperGenList) ? testPaperGenList.forEach(item => {questionIdList.push(item.id)}) : null;
        postPayload["questionIdList"] = questionIdList;
        postPayload["testPaperName"] = payload.testPaperName;
        // 这些是自动组卷的Ids
        postPayload["TKTIdList"] = [];
        postPayload["XZTIdList"] = [];
        postPayload["PDTIdList"] = [];
        postPayload["JDTIdList"] = [];
        // 把自动组卷的Ids装进去
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
        const res = yield call(requestService.questionGen2, postPayload);
        // Response  mixin的 blob()方法使用一个 Response 流，并将其读取完成。它返回一个使用Blob解决的promise。
        res.blob().then(b => {
          let a = document.createElement("a");
          a.href = URL.createObjectURL(b);
          a.download = "试卷导出.docx";
          a.style.display = "none";
          document.body.appendChild(a);
          a.click();
          URL.revokeObjectURL(a.href);
          a.remove();
          message.success("生成Word文件成功", 2)
        })

      } catch (e) {
        console.log(e)
      }
    }

  },
  subscriptions: {}
}
