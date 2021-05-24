package com.teemo.testpapergeneration.controller;

import com.alibaba.fastjson.JSONObject;
import com.teemo.testpapergeneration.entity.QuestionGenHistory;
import com.teemo.testpapergeneration.entity.TestPaperGenHistory;
import com.teemo.testpapergeneration.mapper.QuestionGenHistoryMapper;
import com.teemo.testpapergeneration.mapper.TestPaperGenHistoryMapper;
import com.teemo.testpapergeneration.utils.MyJsonResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class QuestionGenHistoryController {

    MyJsonResponse myJsonResponse = new MyJsonResponse();

    final
    TestPaperGenHistoryMapper testPaperGenHistoryMapper;

    final
    QuestionGenHistoryMapper questionGenHistoryMapper;

    public QuestionGenHistoryController(QuestionGenHistoryMapper questionGenHistoryMapper, TestPaperGenHistoryMapper testPaperGenHistoryMapper) {
        this.questionGenHistoryMapper = questionGenHistoryMapper;
        this.testPaperGenHistoryMapper = testPaperGenHistoryMapper;
    }

    @GetMapping(value = "/getQuestionGenHistoriesByTestPaperUid", produces = "text/plain;charset=UTF-8")
    public String getQuestionGenHistoriesByTestPaperUid(@RequestParam("test_paper_uid") String test_paper_uid) {
        List<QuestionGenHistory> questionGenHistoriesByTestPaperUid = questionGenHistoryMapper.getQuestionGenHistoriesByTestPaperUid(test_paper_uid);
        return myJsonResponse.make200Resp(MyJsonResponse.default_200_response, questionGenHistoriesByTestPaperUid);
    };

    // 删除历史记录的接口
    @GetMapping(value = "/deleteQuestionGenHistoryByTestPaperUid", produces = "text/plain;charset=UTF-8")
    public String deleteQuestionGenHistoryByTestPaperUid(@RequestParam("test_paper_uid") String test_paper_uid) {
        Integer delQuestionCount = questionGenHistoryMapper.deleteQuestionGenHistoryByTestPaperUid(test_paper_uid);
        Integer delTestPaperCount = testPaperGenHistoryMapper.deleteTestPaperGenHistoryByTestPaperUid(test_paper_uid);
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("delQuestionCount", delQuestionCount);
        jsonObject.put("delTestPaperCount",delTestPaperCount);
        return myJsonResponse.make200Resp(MyJsonResponse.default_200_response, jsonObject);
    }
}
