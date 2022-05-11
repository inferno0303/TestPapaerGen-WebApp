package com.teemo.testpapergeneration.services;


import com.teemo.testpapergeneration.entity.QuestionBank;
import com.teemo.testpapergeneration.entity.QuestionGenHistory;
import com.teemo.testpapergeneration.entity.TestPaperGenHistory;
import com.teemo.testpapergeneration.mapper.QuestionGenHistoryMapper;
import com.teemo.testpapergeneration.mapper.TestPaperGenHistoryMapper;
import com.teemo.testpapergeneration.utils.MyUtils;
import freemarker.template.Configuration;
import freemarker.template.Template;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

@Service
public class GenWord {

    @Autowired
    QuestionGenHistoryMapper questionGenHistoryMapper;
    @Autowired
    TestPaperGenHistoryMapper testPaperGenHistoryMapper;


    private static final String TEMPLATE_PATH = "classpath:res";

    private static final String OS = System.getProperty("os.name").toLowerCase();

    private static final String HOME_PATH = System.getProperty("user.home");

    public static boolean isWindows() {
        return OS.contains("windows");
    }

    public static String getHomePath() {
        return HOME_PATH;
    }
    private static File resultFile = null;

    public static String getTemplatePath() {
        // 返回时/tmp/形式的，注意最后面有 /
        return System.getProperty("java.io.tmpdir").concat(isWindows() ? "" : "/");
    }

    public File getFile() {
        if (resultFile != null) {
            return resultFile;
        } else {
            return null;
        }
//      return new File(getHomePath().concat("\\testPaper.xml"));
    };

    public void genWordTest(List<QuestionBank> questionBanks, String test_paper_name, String username) throws IOException {
        // step0 准备输出流
        if (resultFile != null) {
            try {
                boolean delete = resultFile.delete();
                if (delete) {
                    System.out.println("deete temp file ok");
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        File file = File.createTempFile("testPaper", ".xml");
//        File file = new File(getHomePath().concat("\\试卷.xml"));
        FileOutputStream fileOutputStream = new FileOutputStream(file);
        OutputStreamWriter writer = new OutputStreamWriter(fileOutputStream, StandardCharsets.UTF_8);
        BufferedWriter bufferedWriter = new BufferedWriter(writer);
        try {
            // step1 创建freeMarker配置实例
            Configuration configuration = new Configuration(Configuration.VERSION_2_3_30);
            // step2 配置模板路径（类路径）
            configuration.setClassForTemplateLoading(this.getClass(), "/res");
            configuration.setDefaultEncoding("utf-8");
            // step3 加载模版文件
            Template template = configuration.getTemplate("微机原理试卷模板2.ftl");
            // step4 处理数据模型
            HashMap<String, String> dataModel = new HashMap<>();
            String str = "";
            Integer index = 0;
            Double total_score = 0.0;
            for (QuestionBank questionBank : questionBanks) {
                index ++;
                total_score += questionBank.getScore();
                str = str.concat(index + "、" + questionBank.getTopic() + "<w:br />");
            }
            dataModel.put("total_score", total_score.toString());
            dataModel.put("total_number", index.toString());
            dataModel.put("topic", str);
            // step5 输出文件
            template.process(dataModel, bufferedWriter);
            // step 6 记录历史
            this.logHistory(questionBanks, test_paper_name, username);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            bufferedWriter.close();
            fileOutputStream.close();
            resultFile = file;
        }
    }

    // 记录历史
    private void logHistory(List<QuestionBank> questionBanks, String test_paper_name, String username) {
        TestPaperGenHistory testPaperGenHistory = new TestPaperGenHistory();
        // 当前时间
        Date currentTime = new Date();
        // 生成试卷号 uid
        String featureCode = currentTime.getTime() + "_" + Math.random() * 10;
        String md5Digest = MyUtils.calcStringMD5(featureCode);

        // 写试卷历史记录 TestPaperGenHistory 表
        testPaperGenHistory.setTest_paper_uid(md5Digest);
        testPaperGenHistory.setTest_paper_name(test_paper_name);
        testPaperGenHistory.setQuestion_count(questionBanks.size());
        double sum = 0;
        for (QuestionBank each : questionBanks) {
            sum += each.getDifficulty();
        }
        testPaperGenHistory.setAverage_difficulty(sum / questionBanks.size());
        testPaperGenHistory.setUpdate_time(currentTime);
        testPaperGenHistory.setUsername(username);

        // 写题目历史记录 QuestionGenHistory 表
        List<QuestionGenHistory> questionGenHistoryList = new ArrayList<>();
        for (QuestionBank each : questionBanks) {
            QuestionGenHistory questionGenHistory = new QuestionGenHistory();
            questionGenHistory.setTest_paper_uid(md5Digest);
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
            questionGenHistory.setUpdate_time(currentTime);
            questionGenHistoryList.add(questionGenHistory);
        }
        Integer insertCount = questionGenHistoryMapper.insertQuestionGenHistories(questionGenHistoryList);
        Integer insertCount2 = testPaperGenHistoryMapper.insertTestPaperGenHistory(testPaperGenHistory);
        System.out.println(insertCount + "_" + insertCount2);
    }

}
