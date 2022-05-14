package com.teemo.testpapergeneration.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.teemo.testpapergeneration.entity.QuestionBank;
import com.teemo.testpapergeneration.entity.QuestionGenHistory;
import com.teemo.testpapergeneration.entity.TestPaperGenHistory;
import com.teemo.testpapergeneration.mapper.QuestionBankMapper;
import com.teemo.testpapergeneration.mapper.QuestionGenHistoryMapper;
import com.teemo.testpapergeneration.mapper.TestPaperGenHistoryMapper;
import com.teemo.testpapergeneration.services.GenWord;
import com.teemo.testpapergeneration.services.GeneticIteration;
import com.teemo.testpapergeneration.services.RandomSelectTopic;
import com.teemo.testpapergeneration.services.WordExport;
import com.teemo.testpapergeneration.utils.MyJsonResponse;
import com.teemo.testpapergeneration.utils.MyUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.util.*;

@RestController
public class QuestionGenController {

    MyJsonResponse myJsonResponse = new MyJsonResponse();
    @Autowired
    GenWord genWord;
    final
    QuestionBankMapper questionBankMapper;
    @Autowired
    QuestionGenHistoryMapper questionGenHistoryMapper;
    @Autowired
    TestPaperGenHistoryMapper testPaperGenHistoryMapper;

    public QuestionGenController(QuestionBankMapper questionBankMapper) {
        this.questionBankMapper = questionBankMapper;
    }

    @PostMapping(value = "/randomSelect")
    public String randomSelect(@RequestBody String payload) {
        JSONObject retJson = new JSONObject();
        try {
            // 解析 RequestBody
            JSONObject payloadInJSON = JSONObject.parseObject(payload);

            // 手动组卷 已手动选择的题目id列表 接下来的查询要排除
            List<Integer> selectedTopicIds = new ArrayList<>();
            for (Object each : JSONArray.parseArray(payloadInJSON.get("selectedTopicIds").toString())) {
                int id = Integer.parseInt(each.toString());
                selectedTopicIds.add(id);
            }
            // 自动组卷 随机题目知识点范围
            List<String> generateRange = new ArrayList<>();
            for (Object each : JSONArray.parseArray(payloadInJSON.get("generateRange").toString())) {
                String s = each.toString();
                generateRange.add(s);
            }
            // 自动组卷 填空题数量 该类型随机出题循环限制数
            int TKTCount = Integer.parseInt(payloadInJSON.get("TKTCount").toString());
            // 自动组卷 选择题数量 该类型随机出题循环限制数
            int XZTCount = Integer.parseInt(payloadInJSON.get("XZTCount").toString());
            // 自动组卷 判断题数量 该类型随机出题循环限制数
            int PDTCount = Integer.parseInt(payloadInJSON.get("PDTCount").toString());
            // 自动组卷 简答题数量 该类型随机出题循环限制数
            int JDTCount = Integer.parseInt(payloadInJSON.get("JDTCount").toString());
            // 自动组卷 平均难度 随机出题目标难度参数
            double averageDifficulty = Double.parseDouble(payloadInJSON.get("averageDifficulty").toString());

            // 查询满足条件的题目总列表，条件是：1、不在ids列表里; 2、在出题范围里
            List<QuestionBank> randomQuestionBankList = questionBankMapper.getQuestionBankByIds(selectedTopicIds, generateRange);
            // 分门别类
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
            // 贪心法随机出题
            RandomSelectTopic randomSelectTopic = new RandomSelectTopic();
            List<QuestionBank> TKTList = randomSelectTopic.randomSelectTopic(TKTRandomList, averageDifficulty, TKTCount);
            List<QuestionBank> XZTList = randomSelectTopic.randomSelectTopic(XZTRandomList, averageDifficulty, XZTCount);
            List<QuestionBank> PDTList = randomSelectTopic.randomSelectTopic(PDTRandomList, averageDifficulty, PDTCount);
            List<QuestionBank> JDTList = randomSelectTopic.randomSelectTopic(JDTRandomList, averageDifficulty, JDTCount);
            retJson.put("TKTList", TKTList);
            retJson.put("XZTList", XZTList);
            retJson.put("PDTList", PDTList);
            retJson.put("JDTList", JDTList);
            return myJsonResponse.make200Resp(MyJsonResponse.default_200_response, retJson);
        } catch (Exception e) {
            return myJsonResponse.make500Resp(MyJsonResponse.default_500_response, e.toString());
        }
    }

    @PostMapping(value = "/geneticSelect")
    public String geneticSelect(@RequestBody String request) {
        try {
            JSONObject payloadInJSON = JSONObject.parseObject(request);
            // 手动组卷 已手动选择的题目id列表 接下来的查询要排除
            List<Integer> selectedTopicIds = new ArrayList<>();
            for (Object each : JSONArray.parseArray(payloadInJSON.get("selectedTopicIds").toString())) {
                int id = Integer.parseInt(each.toString());
                selectedTopicIds.add(id);
            }
            // 自动组卷 随机题目知识点范围
            List<String> generateRange = new ArrayList<>();
            for (Object each : JSONArray.parseArray(payloadInJSON.get("generateRange").toString())) {
                String s = each.toString();
                generateRange.add(s);
            }
            // 遗传算法 填空题数量 该类型随机出题循环限制数
            int TKTCount = Integer.parseInt(payloadInJSON.get("TKTCount").toString());
            // 遗传算法 选择题数量 该类型随机出题循环限制数
            int XZTCount = Integer.parseInt(payloadInJSON.get("XZTCount").toString());
            // 遗传算法 判断题数量 该类型随机出题循环限制数
            int PDTCount = Integer.parseInt(payloadInJSON.get("PDTCount").toString());
            // 遗传算法 简答题数量 该类型随机出题循环限制数
            int JDTCount = Integer.parseInt(payloadInJSON.get("JDTCount").toString());
            // 遗传算法 平均难度 随机出题目标难度参数
            double targetDifficulty = Double.parseDouble(payloadInJSON.get("averageDifficulty").toString());
            // 遗传算法 迭代次数
            int iterationsNum = Integer.parseInt(payloadInJSON.get("iterationsNum").toString());


            // 查询满足条件的题目总列表，条件是：1、不在ids列表里; 2、在出题范围里
            List<QuestionBank> randomQuestionBankList = questionBankMapper.getQuestionBankByIds(selectedTopicIds, generateRange);

            GeneticIteration gi = new GeneticIteration(iterationsNum, randomQuestionBankList, targetDifficulty, TKTCount, XZTCount, PDTCount, JDTCount);
            gi.run();
            List<QuestionBank> TKTList = gi.TKTCurrent;
            List<QuestionBank> XZTList = gi.XZTCurrent;
            List<QuestionBank> PDTList = gi.PDTCurrent;
            List<QuestionBank> JDTList = gi.JDTCurrent;
            JSONObject res = new JSONObject();
            res.put("TKTList", TKTList);
            res.put("XZTList", XZTList);
            res.put("PDTList", PDTList);
            res.put("JDTList", JDTList);
            res.put("variance", gi.variance);
            return myJsonResponse.make200Resp(MyJsonResponse.default_200_response, res);
        } catch (Exception e) {
            return myJsonResponse.make500Resp(MyJsonResponse.default_500_response, e.toString());
        }
    }

    @PostMapping(value = "/questionGen")
    public String questionGen(@RequestBody String payload, HttpServletRequest request) throws IOException {
        String username = request.getSession().getAttribute("username").toString();

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
        genWord.genWordTest(questionBanks, testPaperName, username);
        return myJsonResponse.make200Resp(MyJsonResponse.default_200_response, null);
    }

    @PostMapping(value = "/questionGen2")
    public Object questionGen2(@RequestBody String payload, HttpServletRequest request) throws IOException {
        String username = request.getSession().getAttribute("username").toString();

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

        // 生成模板填充信息
        HashMap<String, String> map = new HashMap<>();
        int total_score = 0;
        int total_count = 0;
        String contents = "";
        for (QuestionBank q : questionBanks) {
            total_score += q.getScore();
            total_count ++;
            contents = contents.concat(total_count + "、" + "（本题" + q.getScore() + "分）" + q.getTopic() + "\r\r");
        }
        map.put("total_score", String.valueOf(total_score));
        map.put("total_count", String.valueOf(total_count));
        map.put("contents", contents);

        WordExport we = new WordExport(map);
        File file = we.exportTestPaper(1);
        logHistory(questionBanks, testPaperName, username, file);
        return downloadFile(file);
    }

    @GetMapping("/getFile")
    public ResponseEntity<FileSystemResource> getFile() {
      return downloadFile(genWord.getFile());
    };

    public static ResponseEntity<FileSystemResource> downloadFile(File file) {
        if (file == null) {
            return null;
        }
        HttpHeaders headers = new HttpHeaders();
        headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
        headers.add("Content-Disposition", "attachment; filename=TestPaperExport_" + new Date().getTime() + ".docx");
        headers.add("Pragma", "no-cache");
        headers.add("Expires", "0");
        headers.add("Last-Modified", new Date().toString());
        return ResponseEntity
                .ok()
                .headers(headers)
                .contentLength(file.length())
                .contentType(MediaType.parseMediaType("application/octet-stream"))
                .body(new FileSystemResource(file));
    }

    private void logHistory(List<QuestionBank> questionBanks, String test_paper_name, String username, File file) {

        // 时间
        Date date = new Date();
        // 写试卷历史记录 TestPaperGenHistory 表
        TestPaperGenHistory testPaperGenHistory = new TestPaperGenHistory();
        // 生成试卷号 uid
        String uid = file.getName() + "_" + UUID.randomUUID().toString().replace("-", "").toLowerCase() + "_" + date.getTime();
        testPaperGenHistory.setTest_paper_uid(uid);
        testPaperGenHistory.setTest_paper_name(test_paper_name);
        testPaperGenHistory.setQuestion_count(questionBanks.size());
        // 难度统计
        double d = 0;
        for (QuestionBank each : questionBanks) {
            d += each.getDifficulty();
        }
        testPaperGenHistory.setAverage_difficulty(d / questionBanks.size());
        testPaperGenHistory.setUpdate_time(date);
        testPaperGenHistory.setUsername(username);

        // 写题目历史记录 QuestionGenHistory 表
        List<QuestionGenHistory> questionGenHistoryList = new ArrayList<>();
        for (QuestionBank each : questionBanks) {
            QuestionGenHistory questionGenHistory = new QuestionGenHistory();
            questionGenHistory.setTest_paper_uid(uid);
            questionGenHistory.setTest_paper_name(test_paper_name);
            questionGenHistory.setQuestion_bank_id(each.getId());
            questionGenHistory.setTopic(each.getTopic());
            questionGenHistory.setTopic_material_id(each.getTopic_material_id());
            questionGenHistory.setAnswer(each.getAnswer());
            questionGenHistory.setTopic_type(each.getTopic_type());
            questionGenHistory.setScore(each.getScore());
            questionGenHistory.setDifficulty(each.getDifficulty());
            questionGenHistory.setChapter_1(each.getChapter_1());
            questionGenHistory.setChapter_2(each.getChapter_2());
            questionGenHistory.setLabel_1(each.getLabel_1());
            questionGenHistory.setLabel_2(each.getLabel_2());
            questionGenHistory.setUpdate_time(date);
            questionGenHistoryList.add(questionGenHistory);
        }
        Integer insertCount = questionGenHistoryMapper.insertQuestionGenHistories(questionGenHistoryList);
        Integer insertCount2 = testPaperGenHistoryMapper.insertTestPaperGenHistory(testPaperGenHistory);
        System.out.println(insertCount + "_" + insertCount2);
    }

}

