package com.teemo.testpapergeneration.controller;

import com.teemo.testpapergeneration.entity.TestPaperGenHistory;
import com.teemo.testpapergeneration.mapper.TestPaperGenHistoryMapper;
import com.teemo.testpapergeneration.utils.MyJsonResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class TestPaperGenHistoryController {
    MyJsonResponse myJsonResponse = new MyJsonResponse();

    final
    TestPaperGenHistoryMapper testPaperGenHistoryMapper;

    public TestPaperGenHistoryController(TestPaperGenHistoryMapper testPaperGenHistoryMapper) {
        this.testPaperGenHistoryMapper = testPaperGenHistoryMapper;
    }

    @GetMapping(value = "/getAllTestPaperGenHistory", produces = "text/plain;charset=UTF-8")
    public String getAllTestPaperGenHistory() {
        List<TestPaperGenHistory> testPaperGenHistories = testPaperGenHistoryMapper.queryAllTestPaperGenHistory();
        return myJsonResponse.make200Resp(MyJsonResponse.default_200_response, testPaperGenHistories);
    };

}
