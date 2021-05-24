package com.teemo.testpapergeneration.entity;

import java.util.Date;

public class QuestionBank {
    private Integer id;
    private String topic;
    private Integer topic_material_id;
    private String answer;
    private String topic_type;
    private Double score;
    private Integer difficulty;
    private String chapter_1;
    private String chapter_2;
    private String label_1;
    private String label_2;
    private Date update_time;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public Integer getTopic_material_id() {
        return topic_material_id;
    }

    public void setTopic_material_id(Integer topic_material_id) {
        this.topic_material_id = topic_material_id;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public String getTopic_type() {
        return topic_type;
    }

    public void setTopic_type(String topic_type) {
        this.topic_type = topic_type;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public Integer getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(Integer difficulty) {
        this.difficulty = difficulty;
    }

    public String getChapter_1() {
        return chapter_1;
    }

    public void setChapter_1(String chapter_1) {
        this.chapter_1 = chapter_1;
    }

    public String getChapter_2() {
        return chapter_2;
    }

    public void setChapter_2(String chapter_2) {
        this.chapter_2 = chapter_2;
    }

    public String getLabel_1() {
        return label_1;
    }

    public void setLabel_1(String label_1) {
        this.label_1 = label_1;
    }

    public String getLabel_2() {
        return label_2;
    }

    public void setLabel_2(String label_2) {
        this.label_2 = label_2;
    }

    public Date getUpdate_time() {
        return update_time;
    }

    public void setUpdate_time(Date update_time) {
        this.update_time = update_time;
    }
}
