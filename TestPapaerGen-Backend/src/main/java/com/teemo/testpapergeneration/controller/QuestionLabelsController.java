package com.teemo.testpapergeneration.controller;

import com.alibaba.fastjson.JSONObject;
import com.teemo.testpapergeneration.entity.QuestionLabels;
import com.teemo.testpapergeneration.mapper.QuestionLabelsMapper;
import com.teemo.testpapergeneration.utils.MyJsonResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class QuestionLabelsController {

    MyJsonResponse myJsonResponse = new MyJsonResponse();

    final
    QuestionLabelsMapper questionLabelsMapper;

    public QuestionLabelsController(QuestionLabelsMapper questionLabelsMapper) {
        this.questionLabelsMapper = questionLabelsMapper;
    }

    @GetMapping(value = "/getAllQuestionLabels", produces = "text/plain;charset=UTF-8")
    public String getAllQuestionLabels() {
        List<QuestionLabels> allQuestionLabels = questionLabelsMapper.getAllQuestionLabels();
        return myJsonResponse.make200Resp(MyJsonResponse.default_200_response, allQuestionLabels);
    }

    @GetMapping(value = "/getDistinctChapter1", produces = "text/plain;charset=UTF-8")
    public String getDistinctChapter1() {
        List<QuestionLabels> distinctChapter1 = questionLabelsMapper.getDistinctChapter1();
        List<String> chapter1List = new ArrayList<>();
        for (QuestionLabels questionLabels : distinctChapter1) {
            chapter1List.add(questionLabels.getChapter_1());
        }
        return myJsonResponse.make200Resp(MyJsonResponse.default_200_response, chapter1List);
    }

    @GetMapping(value = "/getDistinctChapter2", produces = "text/plain;charset=UTF-8")
    public String getDistinctChapter2() {
        List<QuestionLabels> distinctChapter2 = questionLabelsMapper.getDistinctChapter2();
        List<String> chapter2List = new ArrayList<>();
        for (QuestionLabels questionLabels : distinctChapter2) {
            chapter2List.add(questionLabels.getChapter_2());
        }
        return myJsonResponse.make200Resp(MyJsonResponse.default_200_response, chapter2List);
    }

    @GetMapping(value = "/getChapter2ByChapter1", produces = "text/plain;charset=UTF-8")
    public String getChapter2ByChapter1(@RequestParam("chapter1") String chapter1) {
        List<QuestionLabels> chapter2ByChapter1 = questionLabelsMapper.getChapter2ByChapter1(chapter1);
        List<String> chapter2List = new ArrayList<>();
        for (QuestionLabels questionLabels : chapter2ByChapter1) {
            chapter2List.add(questionLabels.getChapter_2());
        }
        return myJsonResponse.make200Resp(MyJsonResponse.default_200_response, chapter2List);
    };

    @GetMapping(value = "/getDistinctLabel1", produces = "text/plain;charset=UTF-8")
    public String getDistinctLabel1() {
        List<QuestionLabels> getDistinctLabel1 = questionLabelsMapper.getDistinctLabel1();
        List<String> label1List = new ArrayList<>();
        for (QuestionLabels questionLabels : getDistinctLabel1) {
            label1List.add(questionLabels.getLabel_1());
        }
        return myJsonResponse.make200Resp(MyJsonResponse.default_200_response, label1List);
    }

    @GetMapping(value = "/getDistinctLabel2", produces = "text/plain;charset=UTF-8")
    public String getDistinctLabel2() {
        List<QuestionLabels> getDistinctLabel2 = questionLabelsMapper.getDistinctLabel2();
        List<String> label2List = new ArrayList<>();
        for (QuestionLabels questionLabels : getDistinctLabel2) {
            label2List.add(questionLabels.getLabel_2());
        }
        return myJsonResponse.make200Resp(MyJsonResponse.default_200_response, label2List);
    }

}
