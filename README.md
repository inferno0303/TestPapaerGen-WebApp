# 在线组卷系统

## 介绍

名称：在线组卷系统 - TestPapaerGen

简介：在线组卷系统，题库管理 + 试卷手动/根据规则自动生成，输出排版美观的 word 文档文件

技术栈：后端 Java SpringBoot + 前端 React Umi.js

类型：前后端分离应用，WebApp，外包项目

## 安装

### 目录结构

TestPapaerGen-Backend：后端

TestPapaerGen-Frontend：前端

数据库表结构：数据库

assets：示例文件

文档：一些文档

### 如何运行

后端：标准Java Maven SpringBoot工程，在pom.xml目录下执行mvn install拉取依赖后，mvn package打包jar包，推荐在idea环境下配置maven项目。

```shell
mvn install
mvn package
java -jar ./target/xxx.jar
```

前端：标准webpack工程，在package.json目录下执行npm install拉取依赖，npm start运行工程，npm build构建工程。

```shell
npm install
npm start
npm build
```

数据库：记得导入数据库表结构，默认utf8mb4。

```shell
mysql -u root -h host -p < test_paper_generation_xxx.sql
```

## 功能

1. 登录功能，支持注册账号，登录，基于拦截器实现的权限认证；
2. 题库管理，支持填空题、选择题、判断题、设计题、阅读题多种类型，所有题目可自由增删改查；
3. 手动组卷，支持手动从试题库选择题目，加入组卷列表中，作为题目输出；
4. 自动组卷，支持按照难易度，题目类型数，分值，章节等多个维度按需自动组卷，带随机算法，并非简单查库，可按照相同设置自动出A/B卷。
5. 输出试卷，排版美观，输出openxml格式的文档，可office打开，可以直接打印，效果如下图；
6. 出题历史，如字面意思，可查看出卷历史，统计出卷难度，复盘试卷题型；
7. 完善的可视化统计，各种炫酷的图表，可视化汇报数据状态，基于Echarts。

## 效果

### 组卷排版效果

示例文件见 assets 文件夹

![06-自动组卷效果](https://cdn.jsdelivr.net/gh/yangxu770409504/assets@main/20210527/06-自动组卷效果.63hnjdsqs300.png)

### 登陆页

![00-组卷系统登录页](https://cdn.jsdelivr.net/gh/yangxu770409504/assets@main/20210527/00-组卷系统登录页.1r781xqtyye8.png)



### 欢迎首页

![01-组卷系统首页](https://cdn.jsdelivr.net/gh/yangxu770409504/assets@main/20210527/01-组卷系统首页.5spluxqitqw0.png)



### 题库管理

![02-组卷系统题库](https://cdn.jsdelivr.net/gh/yangxu770409504/assets@main/20210527/02-组卷系统题库.fjvrgl2vm4g.png)



### 题库概览

![03-组卷系统题库概览](https://cdn.jsdelivr.net/gh/yangxu770409504/assets@main/20210527/03-组卷系统题库概览.q2a26v1ojww.png)



### 手动组卷

![04-手动组卷](https://cdn.jsdelivr.net/gh/yangxu770409504/assets@main/20210527/04-手动组卷.6jd8jnn871o0.png)



### 自动组卷

![05-自动组卷](https://cdn.jsdelivr.net/gh/yangxu770409504/assets@main/20210527/05-自动组卷.4apturplzdi0.png)



### 出题历史

![07-出题历史](https://cdn.jsdelivr.net/gh/yangxu770409504/assets@main/20210527/07-出题历史.1om6b3odqnts.png)

### 出题历史试卷详情

<img src="https://cdn.jsdelivr.net/gh/yangxu770409504/assets@main/20210527/08-出题历史试卷详情.5we1hifr3pw0.png" alt="08-出题历史试卷详情" style="zoom:25%;" />



