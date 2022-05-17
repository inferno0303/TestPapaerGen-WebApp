# 在线组卷系统

## 毕设助攻

**发邮件770409504@qq.com，1对1定制，可加急**

## 介绍

名称：在线组卷系统 - TestPapaerGen

简介：自动组卷系统，遗传算法、贪心算法，支持导入题库，手动选择、自动组卷，生成排版美观的Word文档，前后端分离WebApp，Java SpringBoot + React

技术栈：后端 Java SpringBoot + 前端 React Umi.js

类型：WebApp

## 功能

1. 登录功能，支持注册账号，登录，基于拦截器实现的权限认证；
2. 题库管理，支持填空题、选择题、判断题、设计题、阅读题多种类型，所有题目可自由增删改查；
3. 手动组卷，支持手动从试题库选择题目，加入组卷列表中，作为题目输出；
4. 自动组卷，基于遗传迭代算法、贪心最优算法，并非简单查库，可按照相同设置自动出A/B卷，可视化遗传迭代算法的过程；
5. 输出试卷，排版美观，输出.docx格式的文档，可office打开，可以直接打印，效果如下图；
6. 出题历史，可重复导出试卷、导出答案，查看出卷历史、出卷难度；
7. 完善的可视化统计，各种炫酷的图表，可视化汇报数据状态，基于Echarts。

## 运行

### 视频演示

视频演示点击这里👉[视频演示](https://cdn.jsdelivr.net/gh/inferno0303/assets@main/2022/zjxt-20220517.mp4)

示例文件见 assets 文件夹


### 欢迎首页

![欢迎首页](https://cdn.jsdelivr.net/gh/inferno0303/assets@main/2022/zjxt.5wazm0ht27k0.webp)

### 题库管理

![题库管理](https://cdn.jsdelivr.net/gh/inferno0303/assets@main/2022/zjxt.6k3izqsxtig0.webp)

### 导出试卷文档

- 支持导出word格式文档
- 支持导出参考答案

![导出试卷文档](https://cdn.jsdelivr.net/gh/inferno0303/assets@main/2022/zjxt.4aw16jt2ug60.webp)

### 导入题库

- 支持导入Excel格式的题库

![导入题库](https://cdn.jsdelivr.net/gh/inferno0303/assets@main/2022/zjxt.3kga2ktq36u0.webp)

### 题库概览

![题库概览](https://cdn.jsdelivr.net/gh/inferno0303/assets@main/2022/zjxt.4d4a464c2xs0.webp)

### 自动组卷

![自动组卷](https://cdn.jsdelivr.net/gh/inferno0303/assets@main/2022/zjxt.6j183ph2n600.webp)

### 出题历史

![出题历史](https://cdn.jsdelivr.net/gh/inferno0303/assets@main/2022/zjxt.1sb3o45h1u4g.webp)

### 注册账户、管理员账户

![注册账户、管理员账户](https://cdn.jsdelivr.net/gh/inferno0303/assets@main/2022/zjxt.2eqpbzzben28.webp)

## 安装

### 目录结构

TestPapaerGen-Backend：后端

TestPapaerGen-Frontend：前端

数据库表结构：数据库

assets：示例文件

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

数据库：记得导入数据库表结构，默认utf8mb4，数据库表结构sql文件已包含建库、建表语句。

```shell
mysql -u root -h host -p < xxx.sql
```
