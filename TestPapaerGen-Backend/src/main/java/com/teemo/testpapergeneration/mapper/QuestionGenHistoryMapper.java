package com.teemo.testpapergeneration.mapper;

import com.teemo.testpapergeneration.entity.QuestionGenHistory;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface QuestionGenHistoryMapper {

    public Integer insertQuestionGenHistories(List<QuestionGenHistory> list);

    @Select("select * from QuestionGenHistory where test_paper_uid=#{test_paper_uid}")
    public List<QuestionGenHistory> getQuestionGenHistoriesByTestPaperUid(String test_paper_uid);

    @Delete("delete from QuestionGenHistory where test_paper_uid=#{test_paper_uid}")
    public Integer deleteQuestionGenHistoryByTestPaperUid(String test_paper_uid);

}
