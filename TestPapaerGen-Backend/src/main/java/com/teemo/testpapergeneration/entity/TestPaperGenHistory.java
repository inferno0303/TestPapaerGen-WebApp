package com.teemo.testpapergeneration.entity;

import java.util.Date;

public class TestPaperGenHistory {
    private Integer id;
    private String test_paper_uid;
    private String test_paper_name;
    private Integer question_count;
    private Double average_difficulty;
    private Date update_time;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    private String username;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTest_paper_uid() {
        return test_paper_uid;
    }

    public void setTest_paper_uid(String test_paper_uid) {
        this.test_paper_uid = test_paper_uid;
    }

    public String getTest_paper_name() {
        return test_paper_name;
    }

    public void setTest_paper_name(String test_paper_name) {
        this.test_paper_name = test_paper_name;
    }

    public Integer getQuestion_count() {
        return question_count;
    }

    public void setQuestion_count(Integer question_count) {
        this.question_count = question_count;
    }

    public Double getAverage_difficulty() {
        return average_difficulty;
    }

    public void setAverage_difficulty(Double average_difficulty) {
        this.average_difficulty = average_difficulty;
    }

    public Date getUpdate_time() {
        return update_time;
    }

    public void setUpdate_time(Date update_time) {
        this.update_time = update_time;
    }
}
