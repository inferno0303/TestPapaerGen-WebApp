package com.teemo.testpapergeneration.test;

import freemarker.template.Configuration;
import freemarker.template.Template;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

public class Test1 {
    private static final String TEMPLATE_PATH = "src/main/java/com/teemo/testpapergeneration/services";

    private static final String OS = System.getProperty("os.name").toLowerCase();

    private static final String HOME_PATH = System.getProperty("user.home");

    public static boolean isWindows() {
        return OS.contains("windows");
    }

    public static String getHomePath() {
        return HOME_PATH;
    }

    public static String getTemplatePath() {
        // 返回时/tmp/形式的，注意最后面有 /
        return System.getProperty("java.io.tmpdir").concat(isWindows() ? "" : ".");
    }

    public static void main(String[] args) throws IOException {
        // step0 准备输出流
        File file = new File(getHomePath().concat("\\hello.xml"));
        FileOutputStream fileOutputStream = new FileOutputStream(file);
        OutputStreamWriter writer = new OutputStreamWriter(fileOutputStream, StandardCharsets.UTF_8);
        BufferedWriter bufferedWriter = new BufferedWriter(writer);
        try {
            // step1 创建freeMarker配置实例
            Configuration configuration = new Configuration(Configuration.VERSION_2_3_30);
            // step2 获取模版路径
            configuration.setDirectoryForTemplateLoading(new File(TEMPLATE_PATH));
            // step3 创建数据模型
            Map<String, Object> dataMap = new HashMap<String, Object>();
            dataMap.put("title", "123");
            // step4 加载模版文件
            Template template = configuration.getTemplate("桂林电子科技大学试题.ftl");
            // step5 生成数据
            // step6 输出文件
            template.process(dataMap, bufferedWriter);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            bufferedWriter.close();
            fileOutputStream.close();
        }
    }
}
