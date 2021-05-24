package com.teemo.testpapergeneration.utils;

import com.alibaba.fastjson.JSONObject;
import java.util.Date;

public class MyJsonResponse {

    public static String default_200_response = "请求成功";
    public static String default_403_response = "权限不足";
    public static String default_500_response = "参数错误";
    public static String login_success = "登陆成功";
    public static String login_fail = "登陆失败";
    public static String logout_success = "注销登陆";

    public String makeResp(Integer code, String msg, Object data) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("code", code);
        jsonObject.put("msg", msg);
        jsonObject.put("data", data);
        return jsonObject.toJSONString();
    }

    public String make200Resp(String msg, Object data) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("code", 200);
        jsonObject.put("msg", msg);
        jsonObject.put("data", data);
        return jsonObject.toJSONString();
    }

    public String make500Resp(String msg, Object o) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("code", 500);
        jsonObject.put("msg", msg);
        long time = new Date().getTime();
        jsonObject.put("data", "request parameter error, log time:" + time);
        return jsonObject.toJSONString();
    }

    public String make403Resp(String msg) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("code", 403);
        jsonObject.put("msg", msg);
        long time = new Date().getTime();
        jsonObject.put("data", "permission denied, log time:" + time);
        return jsonObject.toJSONString();
    }

}
