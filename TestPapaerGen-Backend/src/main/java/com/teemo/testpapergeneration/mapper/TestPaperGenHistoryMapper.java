package com.teemo.testpapergeneration.mapper;

import com.teemo.testpapergeneration.entity.TestPaperGenHistory;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface TestPaperGenHistoryMapper {

    @Insert("insert into TestPaperGenHistory" +
            "(test_paper_uid, test_paper_name, question_count, average_difficulty, update_time, username)" +
            "values" +
            "(#{test_paper_uid}, #{test_paper_name}, #{question_count}, #{average_difficulty}, #{update_time}, #{username})")
    public Integer insertTestPaperGenHistory(TestPaperGenHistory testPaperGenHistory);

    @Select("select * from TestPaperGenHistory order by update_time desc")
    public List<TestPaperGenHistory> queryAllTestPaperGenHistory();

    @Delete("delete from TestPaperGenHistory where test_paper_uid=#{test_paper_uid}")
    public Integer deleteTestPaperGenHistoryByTestPaperUid(String test_paper_uid);
}
