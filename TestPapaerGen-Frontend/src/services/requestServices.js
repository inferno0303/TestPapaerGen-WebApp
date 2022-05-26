import { request } from 'umi';
import { API } from '../config/requestConfig';
import { parseParams } from '../utils/myUtils';

// login
export function login(payload) {
  const url = `${API}/login`;
  return request(url, {
    method: 'post',
    data: payload,
    mode: 'cors',
    credentials: 'include'
  })
}

// getLoginStatus
export function getLoginStatus() {
  const url = `${API}/getLoginStatus`;
  return request(url, {
    method: 'get',
    mode: 'cors',
    credentials: 'include'
  })
}

// logout
export function logout() {
  const url = `${API}/logout`;
  return request(url, {
    method: 'post',
    mode: 'cors',
    credentials: 'include'
  })
}

// registered
export function registered(payload) {
  const url = `${API}/registered`;
  return request(url, {
    method: 'post',
    data: payload,
    mode: 'cors',
    credentials: 'include'
  })
}

// getAllUser
export function getAllUser() {
  const url = `${API}/getAllUser`;
  return request(url, {
    method: 'get',
    mode: 'cors',
    credentials: 'include'
  })
}

// deleteUser
export function deleteUser(payload) {
  const url = `${API}/deleteUser`;
  return request(url, {
    method: 'get',
    mode: 'cors',
    params: payload,
    credentials: 'include'
  })
}

// getApplyUser
export function getApplyUser() {
  const url = `${API}/getApplyUser`;
  return request(url, {
    method: 'get',
    mode: 'cors',
    credentials: 'include'
  })
}

// passApply
export function passApply(payload) {
  const url = `${API}/passApply`;
  return request(url, {
    method: 'get',
    mode: 'cors',
    params: payload,
    credentials: 'include'
  })
}

// deleteApply
export function deleteApply(payload) {
  const url = `${API}/deleteApply`;
  return request(url, {
    method: 'get',
    mode: 'cors',
    params: payload,
    credentials: 'include'
  })
}

// questionBank

export function getQuestionBank() {
  const url = `${API}/getAllQuestionBank`;
  return request(url, {
    method: 'get',
    mode: 'cors',
    credentials: 'include'
  })
}

export function deleteSingleQuestionBank(payload) {
  const url = `${API}/deleteSingleQuestionBank`;
  return request(url, {
    method: 'get',
    params: payload,
    mode: 'cors',
    credentials: 'include'
  })
}

export function getEachChapterCount() {
  const url = `${API}/getEachChapterCount`;
  return request(url, {
    method: 'get',
    mode: 'cors',
    credentials: 'include'
  })
}

export function getEachScoreCount() {
  const url = `${API}/getEachScoreCount`;
  return request(url, {
    method: 'get',
    mode: 'cors',
    credentials: 'include'
  })
}


// questionEdit

export function getAllQuestionLabels() {
  const url = `${API}/getAllQuestionLabels`;
  return request(url, {
    method: 'get',
    mode: 'cors',
    credentials: 'include'
  })
}

export function insertSingleQuestionBank(payload) {
  const url = `${API}/insertSingleQuestionBank`;
  return request(url, {
    method: 'post',
    data: payload,
    mode: 'cors',
    credentials: 'include'
  })
}

export function getQuestionBankById(payload) {
  const url = `${API}/getQuestionBankById`;
  return request(url, {
    method: 'get',
    params: payload,
    mode: 'cors',
    credentials: 'include'
  })
}

export function updateQuestionBankById(payload) {
  const url = `${API}/updateQuestionBankById`;
  return request(url, {
    method: 'post',
    data: payload,
    mode: 'cors',
    credentials: 'include'
  })
}

// questionGenerator
export function questionGen(payload) {
  const url = `${API}/questionGen`;
  return request(url, {
    method: 'post',
    data: payload,
    mode: 'cors',
    credentials: 'include'
  })
}

export function randomSelect(payload) {
  const url = `${API}/randomSelect`;
  return request(url, {
    method: 'post',
    data: payload,
    mode: 'cors',
    credentials: 'include'
  })
}

export function geneticSelect(payload) {
  const url = `${API}/geneticSelect`;
  return request(url, {
    method: 'post',
    data: payload,
    mode: 'cors',
    credentials: 'include'
  })
}

export function downloadFile() {
  // 文件下载
  const a = document.createElement('a');
  document.body.append(a);
  const url = `${API}/getFile`;
  a.href = url;
  a.download = '试卷.docx';
  a.target = '_blank';
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

// questionGenHistory
export function getAllTestPaperGenHistory() {
  const url = `${API}/getAllTestPaperGenHistory`;
  return request(url, {
    method: 'get',
    mode: 'cors',
    credentials: 'include'
  })
}

export function getQuestionGenHistoriesByTestPaperUid(payload) {
  const url = `${API}/getQuestionGenHistoriesByTestPaperUid`;
  return request(url, {
    method: 'get',
    params: payload,
    mode: 'cors',
    credentials: 'include'
  })
}

export function deleteQuestionGenHistoryByTestPaperUid(payload) {
  const url = `${API}/deleteQuestionGenHistoryByTestPaperUid`;
  return request(url, {
    method: 'get',
    params: payload,
    mode: 'cors',
    credentials: 'include'
  })
}

export function uploadFile(payload) {
  const url = `${API}/upload`;
  return request(url, {
    method: 'post',
    data: payload,
    mode: 'cors',
    credentials: 'include'
  })
}

// 新 生成word接口
export function questionGen2(payload) {
  const url = `${API}/questionGen2`;
  return request(url, {
    method: 'post',
    data: payload,
    mode: 'cors',
    credentials: 'include',
    parseResponse: false // 关闭返回值简化
  })
}

// 重新导出word接口
export function reExportTestPaper(payload) {
  const url = `${API}/reExportTestPaper`;
  return request(url, {
    method: 'get',
    params: payload,
    mode: 'cors',
    credentials: 'include',
    parseResponse: false // 关闭返回值简化
  })
}

// 导出答案接口
export function exportAnswer(payload) {
  const url = `${API}/exportAnswer`;
  return request(url, {
    method: 'get',
    params: payload,
    mode: 'cors',
    credentials: 'include',
    parseResponse: false // 关闭返回值简化
  })
}

// 获取所有题目类型
export function getTopicType(payload) {
  const url = `${API}/getTopicType`;
  return request(url, {
    method: "get",
    params: payload,
    mode: "cors",
    credentials: "include",
  })
}

// 搜索题目
export function searchQuestionByTopic(payload) {
  const url = `${API}/searchQuestionByTopic`;
  return request(url, {
    method: "get",
    params: payload,
    mode: "cors",
    credentials: "include",
  })
}

// 新 更新已经组卷的题目
export function updateQuestionGenHistory(payload) {
  const url = `${API}/updateQuestionGenHistory`;
  return request(url, {
    method: 'post',
    data: payload,
    mode: 'cors',
    credentials: 'include',
  })
}