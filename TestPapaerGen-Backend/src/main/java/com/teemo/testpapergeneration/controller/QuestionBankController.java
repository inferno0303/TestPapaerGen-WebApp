package com.teemo.testpapergeneration.controller;

import com.alibaba.fastjson.JSONObject;
import com.teemo.testpapergeneration.entity.QuestionBank;
import com.teemo.testpapergeneration.mapper.QuestionBankMapper;
import com.teemo.testpapergeneration.services.ExcelReader;
import com.teemo.testpapergeneration.utils.MyJsonResponse;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
public class QuestionBankController {

    MyJsonResponse myJsonResponse = new MyJsonResponse();

    final
    QuestionBankMapper questionBankMapper;

    public QuestionBankController(QuestionBankMapper questionBankMapper) {
        this.questionBankMapper = questionBankMapper;
    }

    @GetMapping(value = "/getAllQuestionBank", produces = "text/plain;charset=UTF-8")
    public String getAllQuestionBank() {
        List<QuestionBank> allQuestionBank = questionBankMapper.getAllQuestionBank();
        return myJsonResponse.make200Resp(MyJsonResponse.default_200_response, allQuestionBank);
    }

    @GetMapping(value = "/getQuestionBank", produces = "text/plain;charset=UTF-8")
    public String getQuestionBank(@RequestParam("startItem") Integer startItem,
                                  @RequestParam("endItem") Integer endItem) {
        List<QuestionBank> questionBankList = questionBankMapper.getAllQuestionBank();
        return myJsonResponse.make200Resp(MyJsonResponse.default_200_response, questionBankList);
    }

    @GetMapping(value = "/getTopicType", produces = "text/plain;charset=UTF-8")
    public String getTopicType() {
        List<String> topicType = questionBankMapper.getDistinctTopicType();
        return myJsonResponse.make200Resp(MyJsonResponse.default_200_response, topicType);
    }

    @GetMapping(value = "/searchQuestionByTopic", produces = "text/plain;charset=UTF-8")
    public String searchQuestionByTopic(@RequestParam("topicType") String topicType,
                                 @RequestParam("keyword") String keyword) {
        List<QuestionBank> questions = questionBankMapper.searchQuestionByTopic(topicType, keyword);
        return myJsonResponse.make200Resp(MyJsonResponse.default_200_response, questions);
    }

    @PostMapping(value = "/insertSingleQuestionBank")
    public String insertSingleQuestionBank(@RequestBody QuestionBank questionBank) {
        questionBank.setUpdate_time(new Date());
        Integer commitStatus = questionBankMapper.insertSingleQuestionBank(questionBank);
        JSONObject retJson = new JSONObject();
        retJson.put("insertStatus", commitStatus);
        retJson.put("insertObject", questionBank);
        return myJsonResponse.make200Resp(MyJsonResponse.default_200_response, retJson);
    }

    @GetMapping(value = "/deleteSingleQuestionBank", produces = "text/plain;charset=UTF-8")
    public String deleteSingleQuestionBank(@RequestParam("id") Integer id) {
        Integer commitStatus = questionBankMapper.deleteSingleQuestionBank(id);
        JSONObject retJson = new JSONObject();
        retJson.put("deleteStatus", commitStatus);
        retJson.put("deleteObject", id);
        return myJsonResponse.make200Resp(MyJsonResponse.default_200_response, retJson);
    }

    @GetMapping(value = "/getQuestionBankById", produces = "text/plain;charset=UTF-8")
    public String getQuestionBankById(@RequestParam("id") Integer id) {
        List<QuestionBank> questionBankByIdList = questionBankMapper.getQuestionBankById(id);
        return myJsonResponse.make200Resp(MyJsonResponse.default_200_response, questionBankByIdList);
    }

    @PostMapping(value = "/updateQuestionBankById")
    public String updateQuestionBankById(@RequestBody QuestionBank questionBank) {
        questionBank.setUpdate_time(new Date());
        Integer updateStatus = questionBankMapper.updateSingleQuestionBank(questionBank);
        JSONObject retJson = new JSONObject();
        retJson.put("updateStatus", updateStatus);
        retJson.put("updateObject", questionBank);
        return myJsonResponse.make200Resp(MyJsonResponse.default_200_response, retJson);
    }

    // 导入excel文件到数据库
    @PostMapping("/upload")
    public String uploadFile(@RequestParam("file") MultipartFile file, @RequestParam("isDeleteAll") boolean isDeleteAll) {
        // 判断一下是否要先 truncate
        int deleteCount = 0;
        int insertCount = 0;
        if (isDeleteAll) {
            List<QuestionBank> allQuestionBank = questionBankMapper.getAllQuestionBank();
            for (QuestionBank questionBank : allQuestionBank) {
                Integer id = questionBank.getId();
                Integer n = questionBankMapper.deleteSingleQuestionBank(id);
                deleteCount += n;
            }
        }
        // 转换成输入流
        InputStream inputStream;
        try {
            inputStream = file.getInputStream();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        // 解析excel内容 -> json list
        ExcelReader er = new ExcelReader(inputStream);
        List<JSONObject> jsonObjectList = er.readExcel();
        // 遍历插入

        for (JSONObject jsonObject : jsonObjectList) {
            QuestionBank questionBank = new QuestionBank();
            // topic
            String topic = jsonObject.getString("topic");
            questionBank.setTopic(topic);
            // topic_material_id
            Integer topic_material_id = jsonObject.getInteger("topic_material_id");
            questionBank.setTopic_material_id(topic_material_id);
            // answer
            String answer = jsonObject.getString("answer");
            questionBank.setAnswer(answer);
            // topic_type
            String topic_type = jsonObject.getString("topic_type");
            questionBank.setTopic_type(topic_type);
            // score
            Double score = jsonObject.getDouble("score");
            questionBank.setScore(score);
            // difficulty
            Integer difficulty = jsonObject.getInteger("difficulty");
            questionBank.setDifficulty(difficulty);
            // chapter_1
            String chapter_1 = jsonObject.getString("chapter_1");
            questionBank.setChapter_1(chapter_1);
            // chapter_2
            String chapter_2 = jsonObject.getString("chapter_2");
            questionBank.setChapter_2(chapter_2);
            // label_1
            String label_1 = jsonObject.getString("label_1");
            questionBank.setLabel_1(label_1);
            // label_2
            String label_2 = jsonObject.getString("label_2");
            questionBank.setLabel_2(label_2);
            // update_time
            questionBank.setUpdate_time(new Date());
            // 数据库操作
            Integer n = questionBankMapper.insertSingleQuestionBank(questionBank);
            insertCount += n;
        }
        JSONObject rs = new JSONObject();
        rs.put("deleteCount", deleteCount);
        rs.put("insertCount", insertCount);
        return myJsonResponse.make200Resp(MyJsonResponse.default_200_response, rs);
    }

    // 查询各Label1下的统计数量
    @GetMapping(value = "/getEachChapterCount", produces = "text/plain;charset=UTF-8")
    public String getEachChapterCount() {
        List<String> distinctLabel1FromQuestionBank = questionBankMapper.getDistinctLabel1FromQuestionBank();
        ArrayList<JSONObject> ret = new ArrayList<>();
        for (String eachLabel1 : distinctLabel1FromQuestionBank) {
            Integer count = questionBankMapper.getQuestionBankCountByLabel1(eachLabel1);
            JSONObject _tmp = new JSONObject();
            _tmp.put("label_1", eachLabel1);
            _tmp.put("count", count);
            ret.add(_tmp);
        }
        return myJsonResponse.make200Resp(MyJsonResponse.default_200_response, ret);
    }

    // 查询各Score下的统计数量
    @GetMapping(value = "/getEachScoreCount", produces = "text/plain;charset=UTF-8")
    public String getEachScoreCount() {
        List<Double> distinctScoreFromQuestionBank = questionBankMapper.getDistinctScoreFromQuestionBank();
        ArrayList<JSONObject> ret = new ArrayList<>();
        for (Double eachScore : distinctScoreFromQuestionBank) {
            Integer count = questionBankMapper.getQuestionBankCountByScore(eachScore);
            JSONObject _tmp = new JSONObject();
            _tmp.put("score", eachScore);
            _tmp.put("count", count);
            ret.add(_tmp);
        }
        return myJsonResponse.make200Resp(MyJsonResponse.default_200_response, ret);
    }
}
