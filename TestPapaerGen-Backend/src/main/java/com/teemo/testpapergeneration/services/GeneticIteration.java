package com.teemo.testpapergeneration.services;

import com.teemo.testpapergeneration.entity.QuestionBank;

import java.util.ArrayList;
import java.util.List;

// 遗传迭代算法
public class GeneticIteration {
    private Integer iterationsNum; // 迭代次数
    public List<Double> variance; // 已选度与预设难度的方差，数组，随迭代记录变化
    private final Double targetDifficult; // 预期难度
    public List<QuestionBank> TKTCurrent; // 填空题 已选列表
    public List<QuestionBank> XZTCurrent; // 选择题 已选列表
    public List<QuestionBank> PDTCurrent; // 判断题 已选列表
    public List<QuestionBank> JDTCurrent; // 简答题 已选列表
    private final List<QuestionBank> TKTLibrary; // 填空题 未选列表
    private final List<QuestionBank> XZTLibrary; // 选择题 未选列表
    private final List<QuestionBank> PDTLibrary; // 判断题 未选列表
    private final List<QuestionBank> JDTLibrary; // 简答题 未选列表
    // 操作迭代的题目对象
    private enum OPTarget {
        TKT, XZT, PDT, JDT
    }

    // 构造函数
    public GeneticIteration(Integer iterationsNum, List<QuestionBank> questionList, double targetDifficult, Integer TKTCount, Integer XZTCount, Integer PDTCount, Integer JDTCount) {
        this.iterationsNum = iterationsNum;
        this.targetDifficult = targetDifficult;
        // 构造函数要初始化数组，不然会空指针
        variance = new ArrayList<>();
        TKTLibrary = new ArrayList<>();
        XZTLibrary = new ArrayList<>();
        PDTLibrary = new ArrayList<>();
        JDTLibrary = new ArrayList<>();
        TKTCurrent = new ArrayList<>();
        XZTCurrent = new ArrayList<>();
        PDTCurrent = new ArrayList<>();
        JDTCurrent = new ArrayList<>();
        // 分门别类，先放到未选列表里
        for (QuestionBank q: questionList) {
            switch (q.getTopic_type()) {
                case "填空题":
                    TKTLibrary.add(q);
                    break;
                case "选择题":
                    XZTLibrary.add(q);
                    break;
                case "判断题":
                    PDTLibrary.add(q);
                    break;
                case "程序设计题":
                case "程序阅读题":
                    JDTLibrary.add(q);
                    break;
            }
        }
        // 初始化已选列表。为避免出现空指针异常，先判空，递减预期数量，将 未选列表题 随机搬移到 已选列表 里，当未选列表空时提前终止
        if (TKTLibrary != null) {
            while (TKTCount-- > 0) {
                if (TKTLibrary.size() > 0) {
                    QuestionBank q = TKTLibrary.get((int)(Math.random() * TKTLibrary.size()));
                    TKTLibrary.remove(q);
                    TKTCurrent.add(q);
                } else break;
            }
        }
        if (XZTLibrary != null) {
            while (XZTCount-- > 0) {
                if (XZTLibrary.size() > 0) {
                    QuestionBank q = XZTLibrary.get((int)(Math.random() * XZTLibrary.size()));
                    XZTLibrary.remove(q);
                    XZTCurrent.add(q);
                } else break;
            }
        }
        if (PDTLibrary != null) {
            while (PDTCount-- > 0) {
                if (PDTLibrary.size() > 0) {
                    QuestionBank q = PDTLibrary.get((int)(Math.random() * PDTLibrary.size()));
                    PDTLibrary.remove(q);
                    PDTCurrent.add(q);
                } else break;
            }
        }
        if (JDTLibrary != null) {
            while (JDTCount-- > 0) {
                if (JDTLibrary.size() > 0) {
                    QuestionBank q = JDTLibrary.get((int)(Math.random() * JDTLibrary.size()));
                    JDTLibrary.remove(q);
                    JDTCurrent.add(q);
                } else break;
            }
        }
    }

    public static void main(String[] args) {

    }

    public void run() {
        int n = TKTCurrent.size() + XZTCurrent.size() + PDTCurrent.size() + JDTCurrent.size();
        while (this.iterationsNum-- > 0) { // 迭代次数
            int i = (int) (Math.random() * n); // 随便找一个1~n的倒霉蛋变异
            if (i <= TKTCurrent.size()) { // 倒霉蛋在填空题
                singleIteration(TKTLibrary, TKTCurrent);
            } else if (i <= TKTCurrent.size() + XZTCurrent.size()) { // 倒霉蛋在选择题
                singleIteration(XZTLibrary, XZTCurrent);
            } else if (i <= TKTCurrent.size() + XZTCurrent.size() + PDTCurrent.size()) { // 倒霉蛋在判断题
                singleIteration(PDTLibrary, PDTCurrent);
            } else { // 倒霉蛋在简答题
                singleIteration(JDTLibrary, JDTCurrent);
            }
            double res = calcVariance();
            variance.add(res);
        }
    }

    // 计算当前已选列表与预设难度的方差
    private double calcVariance() {
        double sum = 0;
        for (QuestionBank q: TKTCurrent) {
            double pow = Math.pow(q.getDifficulty() - targetDifficult, 2);
            sum += pow;
        }
        for (QuestionBank q: XZTCurrent) {
            double pow = Math.pow(q.getDifficulty() - targetDifficult, 2);
            sum += pow;
        }
        for (QuestionBank q: PDTCurrent) {
            double pow = Math.pow(q.getDifficulty() - targetDifficult, 2);
            sum += pow;
        }
        for (QuestionBank q: JDTCurrent) {
            double pow = Math.pow(q.getDifficulty() - targetDifficult, 2);
            sum += pow;
        }
        int n = TKTCurrent.size() + XZTCurrent.size() + PDTCurrent.size() + JDTCurrent.size();
        return sum / n;
    }

    // 单次迭代
    private void singleIteration(List<QuestionBank> library, List<QuestionBank> current) {
        if (library.size() > 0 && current.size() > 0){
            // 随机找两个位置
            int index1 = (int)(Math.random() * library.size());
            int index2 = (int)(Math.random() * current.size());
            // 交换一下
            QuestionBank temp = current.get(index2);
            current.set(index2, library.get(index1));
            library.set(index1, temp);
            // 算一下方差
            double v = calcVariance();
            if (variance.size() > 0 && v > variance.get(variance.size() - 1)){
                // 变异失败，换回去
                QuestionBank temp2 = current.get(index2);
                current.set(index2, library.get(index1));
                library.set(index1, temp2);
            }
        }
    }

}
