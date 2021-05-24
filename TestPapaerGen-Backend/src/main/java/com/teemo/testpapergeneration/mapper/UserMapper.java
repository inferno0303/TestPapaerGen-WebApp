package com.teemo.testpapergeneration.mapper;

import com.teemo.testpapergeneration.entity.User;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface UserMapper {

    @Select("select * from User where username=#{username} and password=#{password} and enable=1")
    public List<User> login(User user);

    @Insert("insert into User (username, password, user_role, last_login, enable)" +
            "values(#{username}, #{password}, #{user_role}, #{last_login}, #{enable})")
    public Integer addNewUser(User user);

    @Update("update User set last_login=#{last_login} where username=#{username} and password=#{password}")
    public void updateLastLoginTime(User user);

    @Select("select * from User where username=#{username}")
    public List<User> getUserByUsername(String username);

    @Select("select * from User where enable=0 and user_role='user'")
    public List<User> getApplyUser();

    // 获取所有用户
    @Select("select * from User")
    public List<User> getAllUser();

    // 删除用户
    @Delete("delete from User where username=#{username}")
    public Integer deleteUser(String username);

    // 通过申请
    @Update("update User set enable=1 where username=#{username}")
    public Integer passApply(String username);

    // 删除申请
    @Delete("delete from User where username=#{username}")
    public Integer deleteApply(String username);

}
