package com.teemo.testpapergeneration.mapper;

import com.teemo.testpapergeneration.entity.QuestionLabels;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface QuestionLabelsMapper {

    @Select("select * from QuestionLabels")
    public List<QuestionLabels> getAllQuestionLabels();

    @Select("select distinct chapter_1 from QuestionLabels")
    public List<QuestionLabels> getDistinctChapter1();

    @Select("select distinct chapter_2 from QuestionLabels")
    public List<QuestionLabels> getDistinctChapter2();

    @Select("select distinct chapter_2 from QuestionLabels where chapter_1=#{chapter1}")
    public List<QuestionLabels> getChapter2ByChapter1(String chapter1);

    @Select("select distinct label_1 from QuestionLabels")
    public List<QuestionLabels> getDistinctLabel1();

    @Select("select distinct label_2 from QuestionLabels")
    public List<QuestionLabels> getDistinctLabel2();
}
