package com.teemo.testpapergeneration.config;

import com.teemo.testpapergeneration.component.LoginHandlerInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;


@Configuration
public class LoginInterceptorConfig extends WebMvcConfigurationSupport {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        //添加资源映射
        registry.addResourceHandler("/**").addResourceLocations("classpath:/static/");
        registry.addResourceHandler("/static/**").addResourceLocations("classpath:/static/");
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new LoginHandlerInterceptor())
                .addPathPatterns("/**")
                .excludePathPatterns(
                        // 测试
                        "/hello",
                        // 登录相关
                        "/getLoginStatus",
                        "/login",
                        "/permission_denied",
                        "/registered",
                        // 静态资源
                        "/",
                        "/static/**",
                        "/*.html",
                        "/*.css",
                        "/*.js",
                        "/favicon.*"
                );
    }
}
