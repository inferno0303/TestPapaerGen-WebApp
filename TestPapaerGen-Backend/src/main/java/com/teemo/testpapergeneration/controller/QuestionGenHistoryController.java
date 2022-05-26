package com.teemo.testpapergeneration.controller;

import com.alibaba.fastjson.JSONObject;
import com.teemo.testpapergeneration.entity.QuestionBank;
import com.teemo.testpapergeneration.entity.QuestionGenHistory;
import com.teemo.testpapergeneration.mapper.QuestionBankMapper;
import com.teemo.testpapergeneration.mapper.QuestionGenHistoryMapper;
import com.teemo.testpapergeneration.mapper.TestPaperGenHistoryMapper;
import com.teemo.testpapergeneration.services.WordExport;
import com.teemo.testpapergeneration.utils.MyJsonResponse;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.util.*;

@RestController
public class QuestionGenHistoryController {

    MyJsonResponse myJsonResponse = new MyJsonResponse();

    final
    TestPaperGenHistoryMapper testPaperGenHistoryMapper;

    final
    QuestionGenHistoryMapper questionGenHistoryMapper;
    final
    QuestionBankMapper questionBankMapper;

    public QuestionGenHistoryController(QuestionGenHistoryMapper questionGenHistoryMapper, TestPaperGenHistoryMapper testPaperGenHistoryMapper, QuestionBankMapper questionBankMapper) {
        this.questionGenHistoryMapper = questionGenHistoryMapper;
        this.testPaperGenHistoryMapper = testPaperGenHistoryMapper;
        this.questionBankMapper = questionBankMapper;
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

    /*
    重写这次组卷的历史记录
    @params
     */
    @PostMapping(value = "/updateQuestionGenHistory")
    public String updateQuestionGenHistory(@RequestParam("test_paper_uid") String test_paper_uid,
                                @RequestParam("question_bank_id") int[] question_bank_id) {
        System.out.println("test_paper_uid=" + test_paper_uid + "\n" + "question_bank_id=" + Arrays.toString(question_bank_id));

        // 试卷名字
        List<String> names = testPaperGenHistoryMapper.getTestPaperNameByTestPaperUid(test_paper_uid);
        String test_paper_name = null;
        if (names.size() > 0) {
            test_paper_name = names.get(0);
        }

        // 查询题目
        List<QuestionBank> questions = new ArrayList<>();
        for (int id : question_bank_id) {
            List<QuestionBank> list = questionBankMapper.getQuestionBankById(id);
            if (list.size() != 0) {
                QuestionBank q = list.get(0);
                questions.add(q);
            }
        }

        // 装配列表
        Date date = new Date();
        List<QuestionGenHistory> questionGenHistories = new ArrayList<>();
        for (QuestionBank q : questions) {
            QuestionGenHistory qHistory = new QuestionGenHistory();
            qHistory.setTest_paper_uid(test_paper_uid);
            qHistory.setTest_paper_name(test_paper_name);
            qHistory.setQuestion_bank_id(q.getId());
            qHistory.setTopic(q.getTopic());
            qHistory.setAnswer(q.getAnswer());
            qHistory.setTopic_type(q.getTopic_type());
            qHistory.setScore(q.getScore());
            qHistory.setDifficulty(q.getDifficulty());
            qHistory.setChapter_1(q.getChapter_1());
            qHistory.setChapter_2(q.getChapter_2());
            qHistory.setLabel_1(q.getLabel_1());
            qHistory.setLabel_2(q.getLabel_2());
            qHistory.setUpdate_time(date);
            questionGenHistories.add(qHistory);
        }
        // 更新时间
        Integer i1 = testPaperGenHistoryMapper.updateTestPaperTime(test_paper_uid, date);
        // 删除旧的
        Integer i2 = questionGenHistoryMapper.deleteQuestionGenHistoryByTestPaperUid(test_paper_uid);
        // 插入新的
        Integer i3 = questionGenHistoryMapper.insertQuestionGenHistories(questionGenHistories);
        return myJsonResponse.make200Resp(MyJsonResponse.default_200_response, i1 + i2 + i3);
    }

    // 从历史记录中查询，并重新导出试卷
    @GetMapping(value = "/reExportTestPaper")
    public ResponseEntity<FileSystemResource> reExportTestPaper(@RequestParam("test_paper_uid") String test_paper_uid) {
        // 查找这张试卷的题目 Id
        List<QuestionGenHistory> questionGenHistories = questionGenHistoryMapper.getQuestionGenHistoriesByTestPaperUid(test_paper_uid);
        ArrayList<QuestionBank> questionBanks = new ArrayList<>();
        for (QuestionGenHistory item: questionGenHistories) {
            List<QuestionBank> list = questionBankMapper.getQuestionBankById(item.getQuestion_bank_id());
            if (list.size() == 1) {
                questionBanks.add(list.get(0));
            }
        }
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
        return downloadFile(file);
    }

    // 从历史记录中查询，并导出答案
    @GetMapping(value = "/exportAnswer")
    public ResponseEntity<FileSystemResource> exportAnswer(@RequestParam("test_paper_uid") String test_paper_uid) {
        // 查找这张试卷的题目 Id
        List<QuestionGenHistory> questionGenHistories = questionGenHistoryMapper.getQuestionGenHistoriesByTestPaperUid(test_paper_uid);
        ArrayList<QuestionBank> questionBanks = new ArrayList<>();
        for (QuestionGenHistory item: questionGenHistories) {
            QuestionBank q = questionBankMapper.getQuestionBankById(item.getQuestion_bank_id()).get(0);
            questionBanks.add(q);
        }
        // 生成模板填充信息
        HashMap<String, String> map = new HashMap<>();
        int total_score = 0;
        int total_count = 0;
        String contents = "";
        for (QuestionBank q : questionBanks) {
            total_score += q.getScore();
            total_count ++;
            contents = contents.concat(total_count + "、" + "（本题" + q.getScore() + "分）" + q.getAnswer() + "\r\r");
        }
        map.put("total_score", String.valueOf(total_score));
        map.put("total_count", String.valueOf(total_count));
        map.put("contents", contents);

        WordExport we = new WordExport(map);
        File file = we.exportTestPaper(2);
        return downloadFile(file);
    }

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
}
