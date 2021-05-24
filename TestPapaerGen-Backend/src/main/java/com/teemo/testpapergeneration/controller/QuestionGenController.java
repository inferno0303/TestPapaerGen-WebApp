package com.teemo.testpapergeneration.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.teemo.testpapergeneration.entity.QuestionBank;
import com.teemo.testpapergeneration.mapper.QuestionBankMapper;
import com.teemo.testpapergeneration.services.GenWord;
import com.teemo.testpapergeneration.services.RandomSelectTopic;
import com.teemo.testpapergeneration.utils.MyJsonResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
public class QuestionGenController {

    MyJsonResponse myJsonResponse = new MyJsonResponse();
    @Autowired
    GenWord genWord;

    final
    QuestionBankMapper questionBankMapper;

    public QuestionGenController(QuestionBankMapper questionBankMapper) {
        this.questionBankMapper = questionBankMapper;
    }

    @PostMapping(value = "/randomSelect")
    public String randomSelect(@RequestBody String payload) {
        JSONObject retJson = new JSONObject();
        try {
            // 解析 RequestBody
            JSONObject payloadInJSON = JSONObject.parseObject(payload);

            // 处理 selectedTopicIds，已手动选择的题目id列表
            List<Integer> selectedTopicIds = new ArrayList<>();
            for (Object each : JSONArray.parseArray(payloadInJSON.get("selectedTopicIds").toString())) {
                int id = Integer.parseInt(each.toString());
                selectedTopicIds.add(id);
            }
            // 处理generateRange，随机题目知识点范围
            List<String> generateRange = new ArrayList<>();
            for (Object each : JSONArray.parseArray(payloadInJSON.get("generateRange").toString())) {
                String s = each.toString();
                generateRange.add(s);
            }
            // 处理 int: TKTCount，填空题
            int TKTCount = Integer.parseInt(payloadInJSON.get("TKTCount").toString());
            // 处理 int: XZTCount，选择题
            int XZTCount = Integer.parseInt(payloadInJSON.get("XZTCount").toString());
            // 处理 int: PDTCount，判断题
            int PDTCount = Integer.parseInt(payloadInJSON.get("PDTCount").toString());
            // 处理 int: JDTCount，简答题
            int JDTCount = Integer.parseInt(payloadInJSON.get("JDTCount").toString());
            // 处理 int: averageDifficulty，平均难度
            double averageDifficulty = Double.parseDouble(payloadInJSON.get("averageDifficulty").toString());
            System.out.println("从RequestBody接收数据：===============" + "\nTKTCount:" + TKTCount + "\nXZTCount：" + XZTCount + "\nPDTCount:" + PDTCount + "\nJDTCount：" + JDTCount + "\naverageDifficulty:" + averageDifficulty + "\ngenerateRange：" + generateRange);

            // 查询满足条件的题目总列表，条件是：1、不在ids列表里; 2、在出题范围里
            List<QuestionBank> randomQuestionBankList = questionBankMapper.getQuestionBankByIds(selectedTopicIds, generateRange);
            // 分类
            List<QuestionBank> TKTRandomList = new ArrayList<>();
            List<QuestionBank> XZTRandomList = new ArrayList<>();
            List<QuestionBank> PDTRandomList = new ArrayList<>();
            List<QuestionBank> JDTRandomList = new ArrayList<>();
            for(QuestionBank each : randomQuestionBankList) {
                if (each.getTopic_type().equals("填空题")) TKTRandomList.add(each);
                if (each.getTopic_type().equals("选择题")) XZTRandomList.add(each);
                if (each.getTopic_type().equals("判断题")) PDTRandomList.add(each);
                if (each.getTopic_type().equals("程序设计题") || each.getTopic_type().equals("程序阅读题")) JDTRandomList.add(each);
            }
            // 调用service，实现随机抽题
            RandomSelectTopic randomSelectTopic = new RandomSelectTopic();
            List<QuestionBank> TKTList = randomSelectTopic.randomSelectTopic(TKTRandomList, averageDifficulty, TKTCount);
            List<QuestionBank> XZTList = randomSelectTopic.randomSelectTopic(XZTRandomList, averageDifficulty, XZTCount);
            List<QuestionBank> PDTList = randomSelectTopic.randomSelectTopic(PDTRandomList, averageDifficulty, PDTCount);
            List<QuestionBank> JDTList = randomSelectTopic.randomSelectTopic(JDTRandomList, averageDifficulty, JDTCount);
            System.out.println("填空题：");
            for (QuestionBank each : TKTList) {
                System.out.println("===================================");
                System.out.println("id：" + each.getId());
                System.out.println("getDifficulty：" + each.getDifficulty());
                System.out.println("getTopic" + each.getTopic());
            }
            System.out.println("选择题：");
            for (QuestionBank each : XZTList) {
                System.out.println("===================================");
                System.out.println("id：" + each.getId());
                System.out.println("getDifficulty：" + each.getDifficulty());
                System.out.println("getTopic" + each.getTopic());
            }
            System.out.println("判断题：");
            for (QuestionBank each : PDTList) {
                System.out.println("===================================");
                System.out.println("id：" + each.getId());
                System.out.println("getDifficulty：" + each.getDifficulty());
                System.out.println("getTopic" + each.getTopic());
            }
            System.out.println("简答题：");
            for (QuestionBank each : JDTList) {
                System.out.println("===================================");
                System.out.println("id：" + each.getId());
                System.out.println("getDifficulty：" + each.getDifficulty());
                System.out.println("getTopic" + each.getTopic());
            }
            retJson.put("TKTList", TKTList);
            retJson.put("XZTList", XZTList);
            retJson.put("PDTList", PDTList);
            retJson.put("JDTList", JDTList);
            return myJsonResponse.make200Resp(MyJsonResponse.default_200_response, retJson);
        } catch (Exception e) {
            System.out.println(e.toString());
            return myJsonResponse.make500Resp(MyJsonResponse.default_500_response, e.toString());
        }
    }

    @PostMapping(value = "/questionGen")
    public String questionGen(@RequestBody String payload) throws IOException {

        // 0、序列化 RequestBody
        JSONObject payloadInJSON = JSONObject.parseObject(payload);

        // 1、处理 questionIdList，TKTIdList，PDTIdList，JDTIdList，XZTIdList
        // 其中questionIdList是手动选择的题目id，TKTIdList，PDTIdList，JDTIdList，XZTIdList是随机选择的题目id
        // questionIdList
        List<Integer> questionIdList = new ArrayList<>();
        JSONArray _tmpArray = JSONObject.parseArray(payloadInJSON.get("questionIdList").toString());
        for(Object each : _tmpArray) {
            int id = Integer.parseInt(each.toString());
            questionIdList.add(id);
        }
        // TKTIdList
        List<Integer> TKTIdList = new ArrayList<>();
        _tmpArray = JSONObject.parseArray(payloadInJSON.get("TKTIdList").toString());
        for(Object each : _tmpArray) {
            int id = Integer.parseInt(each.toString());
            TKTIdList.add(id);
        }
        // XZTIdList
        List<Integer> XZTIdList = new ArrayList<>();
        _tmpArray = JSONObject.parseArray(payloadInJSON.get("XZTIdList").toString());
        for(Object each : _tmpArray) {
            int id = Integer.parseInt(each.toString());
            XZTIdList.add(id);
        }
        // PDTIdList
        List<Integer> PDTIdList = new ArrayList<>();
        _tmpArray = JSONObject.parseArray(payloadInJSON.get("PDTIdList").toString());
        for(Object each : _tmpArray) {
            int id = Integer.parseInt(each.toString());
            PDTIdList.add(id);
        }
        // JDTIdList
        List<Integer> JDTIdList = new ArrayList<>();
        _tmpArray = JSONObject.parseArray(payloadInJSON.get("JDTIdList").toString());
        for(Object each : _tmpArray) {
            int id = Integer.parseInt(each.toString());
            JDTIdList.add(id);
        }

        // 2、解析testPaperName
        String testPaperName = payloadInJSON.get("testPaperName").toString();

        // 3、根据Ids查题库
        List<QuestionBank> questionBanks = new ArrayList<>();
        for (Integer eachId : questionIdList) {
            List<QuestionBank> questionBankById = questionBankMapper.getQuestionBankById(eachId);
            if(questionBankById.size() > 0) questionBanks.add(questionBankById.get(0));
            else return myJsonResponse.make200Resp(MyJsonResponse.default_500_response, "传参错误，非法Id：" + eachId);
        }
        for (Integer eachId : TKTIdList) {
            List<QuestionBank> questionBankById = questionBankMapper.getQuestionBankById(eachId);
            if(questionBankById.size() > 0) questionBanks.add(questionBankById.get(0));
            else return myJsonResponse.make200Resp(MyJsonResponse.default_500_response, "传参错误，非法Id：" + eachId);
        }
        for (Integer eachId : XZTIdList) {
            List<QuestionBank> questionBankById = questionBankMapper.getQuestionBankById(eachId);
            if(questionBankById.size() > 0) questionBanks.add(questionBankById.get(0));
            else return myJsonResponse.make200Resp(MyJsonResponse.default_500_response, "传参错误，非法Id：" + eachId);
        }
        for (Integer eachId : PDTIdList) {
            List<QuestionBank> questionBankById = questionBankMapper.getQuestionBankById(eachId);
            if(questionBankById.size() > 0) questionBanks.add(questionBankById.get(0));
            else return myJsonResponse.make200Resp(MyJsonResponse.default_500_response, "传参错误，非法Id：" + eachId);
        }
        for (Integer eachId : JDTIdList) {
            List<QuestionBank> questionBankById = questionBankMapper.getQuestionBankById(eachId);
            if(questionBankById.size() > 0) questionBanks.add(questionBankById.get(0));
            else return myJsonResponse.make200Resp(MyJsonResponse.default_500_response, "传参错误，非法Id：" + eachId);
        }
        System.out.println(questionBanks.size());
        genWord.genWordTest(questionBanks, testPaperName);
        return myJsonResponse.make200Resp(MyJsonResponse.default_200_response, null);
    }

    @GetMapping("/getFile")
    public ResponseEntity<FileSystemResource> getFile() {
      return export(genWord.getFile());
    };

    public ResponseEntity<FileSystemResource> export(File file) {
        if (file == null) {
            return null;
        }
        HttpHeaders headers = new HttpHeaders();
        headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
        headers.add("Content-Disposition", "attachment; filename=" + System.currentTimeMillis() + ".xml");
        headers.add("Pragma", "no-cache");
        headers.add("Expires", "0");
        headers.add("Last-Modified", new Date().toString());
        headers.add("ETag", String.valueOf(System.currentTimeMillis()));
        return ResponseEntity
                .ok()
                .headers(headers)
                .contentLength(file.length())
                .contentType(MediaType.parseMediaType("application/octet-stream"))
                .body(new FileSystemResource(file));
    }
}

