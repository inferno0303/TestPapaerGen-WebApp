package com.teemo.testpapergeneration.controller;

import com.alibaba.fastjson.JSONObject;
import com.teemo.testpapergeneration.entity.User;
import com.teemo.testpapergeneration.mapper.UserMapper;
import com.teemo.testpapergeneration.utils.MyJsonResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.Date;
import java.util.List;

@RestController
public class LoginController {

    MyJsonResponse myJsonResponse = new MyJsonResponse();

    @Autowired
    UserMapper userMapper;

    @GetMapping(value = "/permission_denied", produces = "text/plain;charset=UTF-8") // 没有权限时，转发该请求
    public String permission_denied() {
        return myJsonResponse.make403Resp(MyJsonResponse.default_403_response);
    }

    @GetMapping(value = "/getLoginStatus", produces = "text/plain;charset=UTF-8")
    public String getLoginStatus(HttpSession httpSession) {
        Object username = httpSession.getAttribute("username");
        Object user_role = httpSession.getAttribute("user_role");
        Object last_login = httpSession.getAttribute("last_login");
        if (username != null && user_role != null && last_login != null) {
            JSONObject retData = new JSONObject();
            retData.put("username", username);
            retData.put("user_role", user_role);
            retData.put("last_login", last_login);
            return myJsonResponse.make200Resp(MyJsonResponse.default_200_response, retData);
        } else {
            return myJsonResponse.make403Resp(MyJsonResponse.default_403_response);
        }
    }

    @PostMapping("/login")
    public String login(@RequestBody User user,
                        HttpSession httpSession) {
        user.setLast_login(new Date());
        List<User> userList = userMapper.login(user);
        if (userList.size() > 0) {
            userMapper.updateLastLoginTime(user);
            httpSession.setAttribute("username", userList.get(0).getUsername());
            httpSession.setAttribute("user_role", userList.get(0).getUser_role());
            httpSession.setAttribute("last_login", userList.get(0).getLast_login());
            JSONObject retData = new JSONObject();
            retData.put("username", userList.get(0).getUsername());
            retData.put("user_role", userList.get(0).getUser_role());
            retData.put("last_login", userList.get(0).getLast_login());
            return myJsonResponse.make200Resp(MyJsonResponse.default_200_response, retData);
        } else {
            return myJsonResponse.make403Resp(MyJsonResponse.default_403_response);
        }
    }

    @PostMapping("/logout")
    public String logout(HttpSession httpSession) {
        // 删除 session
        httpSession.invalidate();
        return myJsonResponse.make200Resp(MyJsonResponse.default_200_response, "退出登陆成功");
    }

    // 注册用户
    @PostMapping("/registered")
    public String registered(@RequestBody User user) {
        List<User> userByUsername = userMapper.getUserByUsername(user.getUsername());
        if (userByUsername.size() > 0) {
            return myJsonResponse.make500Resp(MyJsonResponse.default_500_response, "用户名重复");
        }
        user.setLast_login(new Date());
        // 不启用该用户
        user.setEnable(0);
        Integer integer = userMapper.addNewUser(user);
        return myJsonResponse.make200Resp(MyJsonResponse.default_200_response, integer);
    }

    // 获取申请注册的用户
    @GetMapping(value = "/getApplyUser", produces = "text/plain;charset=UTF-8")
    public String getApplyUser(HttpSession httpSession) {
        Object user_role = httpSession.getAttribute("user_role");
        if (!user_role.toString().equals("admin")) return myJsonResponse.make403Resp(MyJsonResponse.default_403_response);
        List<User> applyUser = userMapper.getApplyUser();
        return myJsonResponse.make200Resp(MyJsonResponse.default_200_response, applyUser);
    }

    // 获取所有用户账户
    @GetMapping(value = "/getAllUser", produces = "text/plain;charset=UTF-8")
    public String getAllUser() {
        List<User> allUser = userMapper.getAllUser();
        return myJsonResponse.make200Resp(MyJsonResponse.default_200_response, allUser);
    }

    // 删除用户
    @GetMapping(value = "/deleteUser", produces = "text/plain;charset=UTF-8")
    public String deleteUser(@RequestParam("username") String username) {
        Integer integer = userMapper.deleteUser(username);
        return myJsonResponse.make200Resp(MyJsonResponse.default_200_response, integer);
    }

    // 通过申请
    @GetMapping(value = "/passApply", produces = "text/plain;charset=UTF-8")
    public String passApply(@RequestParam("username") String username) {
        Integer integer = userMapper.passApply(username);
        return myJsonResponse.make200Resp(MyJsonResponse.default_200_response, integer);
    }

    // 删除申请
    @GetMapping(value = "/deleteApply", produces = "text/plain;charset=UTF-8")
    public String deleteApply(@RequestParam("username") String username) {
        Integer integer = userMapper.deleteApply(username);
        return myJsonResponse.make200Resp(MyJsonResponse.default_200_response, integer);
    }

}
