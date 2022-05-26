package com.teemo.testpapergeneration.mapper;

import com.teemo.testpapergeneration.entity.TestPaperGenHistory;
import org.apache.ibatis.annotations.*;

import java.util.Date;
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

    @Select("SELECT test_paper_name FROM TestPaperGenHistory WHERE test_paper_uid=#{test_paper_uid}")
    public List<String> getTestPaperNameByTestPaperUid(String test_paper_uid);

    @Update("UPDATE TestPaperGenHistory SET update_time=#{date} WHERE test_paper_uid=#{test_paper_uid}")
    public Integer updateTestPaperTime(String test_paper_uid, Date date);

    @Delete("delete from TestPaperGenHistory where test_paper_uid=#{test_paper_uid}")
    public Integer deleteTestPaperGenHistoryByTestPaperUid(String test_paper_uid);
}
