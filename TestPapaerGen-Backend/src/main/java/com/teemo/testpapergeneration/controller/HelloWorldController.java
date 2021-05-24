package com.teemo.testpapergeneration.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.Date;

@RestController
public class HelloWorldController {

    @GetMapping(value = "/hello")
    public String HelloWorld() {
        Date date = new Date();
        return "<div style=\"display: flex; align-items: center; justify-content: center; margin: 20px auto; font-size: larger; font-weight: bold;\">" +
                "Spring Boot is Working, the current time is: " + date.toString() +
                "</div>";
    };

    @GetMapping("/")
    public ModelAndView index() {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("forward:/index.html");
        return mv;
    }

}
