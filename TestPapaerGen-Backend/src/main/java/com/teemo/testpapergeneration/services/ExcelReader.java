package com.teemo.testpapergeneration.services;
import com.alibaba.fastjson.JSONObject;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;


public class ExcelReader {
    InputStream inputStream;
    public ExcelReader(InputStream inputStream) {
        this.inputStream = inputStream;
    }

    public List<JSONObject> readExcel() {
        XSSFWorkbook workbook;
        try {
            workbook = new XSSFWorkbook(this.inputStream);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        // 读取第0个工作表
        Sheet sheet = workbook.getSheetAt(0);
        // 输出容器
        List<JSONObject> result = new ArrayList<JSONObject>();
        // 第0行是字段名，忽略，从第二行开始读取
        for (int rowNum = 1; rowNum <= sheet.getLastRowNum(); rowNum++) {
            // 取一行
            Row row = sheet.getRow(rowNum);
            // 每一条记录的容器
            JSONObject r = new JSONObject();

            Cell cell1 = row.getCell(1); // topic
            if (cell1 != null) r.put("topic", cell1.getStringCellValue());

            Cell cell2 = row.getCell(2); // topic_material_id
            if (cell2 != null) r.put("topic_material_id", cell2.getStringCellValue());

            Cell cell3 = row.getCell(3); // answer
            if (cell3 != null) r.put("answer", cell3.getStringCellValue());

            Cell cell4 = row.getCell(4); // topic_type
            if (cell4 != null) r.put("topic_type", cell4.getStringCellValue());

            Cell cell5 = row.getCell(5); // score
            if (cell5 != null) r.put("score", cell5.getNumericCellValue());

            Cell cell6 = row.getCell(6); // difficulty
            if (cell6 != null) r.put("difficulty", cell6.getNumericCellValue());

            Cell cell7 = row.getCell(7); // chapter_1
            if (cell7 != null) r.put("chapter_1", cell7.getStringCellValue());

            Cell cell8 = row.getCell(8); // chapter_2
            if (cell8 != null) r.put("chapter_2", cell8.getStringCellValue());

            Cell cell9 = row.getCell(9); // label_1
            if (cell9 != null) r.put("label_1", cell9.getStringCellValue());

            Cell cell10 = row.getCell(10); // label_2
            if (cell10 != null) r.put("label_2", cell10.getStringCellValue());

            result.add(r);
        }
        return result;
    }

    public static void main(String[] args) {
        File file1 = new File("/Users/xiaobocai/Downloads/QuestionBank.xlsx");
        try {
            XSSFWorkbook workbook = new XSSFWorkbook(file1);
            Sheet sheet = workbook.getSheetAt(0);
            ArrayList<JSONObject> result = new ArrayList<JSONObject>();
            // 第0行是表名，忽略，从第二行开始读取
            for (int rowNum = 1; rowNum <= sheet.getLastRowNum(); rowNum++) {
                Row row = sheet.getRow(rowNum);
                JSONObject jsonObject = new JSONObject();

                Cell cell1 = row.getCell(1); // topic
                if (cell1 != null) jsonObject.put("topic", cell1.getStringCellValue());

                Cell cell2 = row.getCell(2); // topic_material_id
                if (cell2 != null) jsonObject.put("topic_material_id", cell2.getStringCellValue());

                Cell cell3 = row.getCell(3); // answer
                if (cell3 != null) jsonObject.put("answer", cell3.getStringCellValue());

                Cell cell4 = row.getCell(4); // topic_type
                if (cell4 != null) jsonObject.put("topic_type", cell4.getStringCellValue());

                Cell cell5 = row.getCell(5); // score
                if (cell5 != null) jsonObject.put("score", cell5.getNumericCellValue());

                Cell cell6 = row.getCell(6); // difficulty
                if (cell6 != null) jsonObject.put("difficulty", cell6.getNumericCellValue());

                Cell cell7 = row.getCell(7); // chapter_1
                if (cell7 != null) jsonObject.put("chapter_1", cell7.getStringCellValue());

                Cell cell8 = row.getCell(8); // chapter_2
                if (cell8 != null) jsonObject.put("chapter_2", cell8.getStringCellValue());

                Cell cell9 = row.getCell(9); // label_1
                if (cell9 != null) jsonObject.put("label_1", cell9.getStringCellValue());

                Cell cell10 = row.getCell(10); // label_2
                if (cell10 != null) jsonObject.put("label_2", cell10.getStringCellValue());

                result.add(jsonObject);
            }
            System.out.println(result);
        } catch (IOException | InvalidFormatException e) {
            throw new RuntimeException(e);
        }
    }
}
