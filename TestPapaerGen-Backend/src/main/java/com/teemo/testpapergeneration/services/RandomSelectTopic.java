package com.teemo.testpapergeneration.services;

import com.teemo.testpapergeneration.entity.QuestionBank;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class RandomSelectTopic {

    // dataSourceList: 候选题目，除手动选择的
    // targetDifficulty
    public List<QuestionBank> randomSelectTopic(List<QuestionBank> dataSourceList, double targetDifficulty, int selectCount) {

        // 0、准备返回值、合法性校验
        List<QuestionBank> targetTopicList = new ArrayList<>();
        if (dataSourceList.size() == 0 || targetDifficulty < 1 || targetDifficulty > 5 || selectCount == 0) {
            return targetTopicList;
        };


        // 1、排序
        dataSourceList.sort(new Comparator<QuestionBank>() {
            @Override
            public int compare(QuestionBank o1, QuestionBank o2) {
                return o1.getDifficulty() - o2.getDifficulty();
            }
        });

        // 2、用于选取多个符合要求的题目
        while (selectCount-- > 0) {
            // 3、找目标题目，约束条件是与预设难度差最小（可能有很多题目都符合要求）
            if (dataSourceList.size() > 0) {
                QuestionBank targetTopic = dataSourceList.get(0);
                double deltaDifficulty = Math.abs(targetTopic.getDifficulty() - targetDifficulty);
                for (QuestionBank each : dataSourceList) {
                    double abs = Math.abs(each.getDifficulty() - targetDifficulty);
                    if (abs <= deltaDifficulty) {
                        deltaDifficulty = abs;
                        targetTopic = each;
                    }
                }
                // 计算预取列表，预取列表的元素都是与目标难度delta最小的题目，列表中任何一个元素皆满足抽取要求
                List<QuestionBank> _tmpList = new ArrayList<>();
                for (QuestionBank each : dataSourceList) {
                    if (each.getDifficulty().equals(targetTopic.getDifficulty())) {
                        _tmpList.add(each);
                    }
                }
                // 通过随机下标，从预取列表抽取题目，如预取列表为空，则目标题目就是targetTopic，否则从预取列表中随机选取一个
                if (_tmpList.size() > 0) {
                    int randomIndex = (int) (Math.random() * _tmpList.size());
                    targetTopic = _tmpList.get(randomIndex);
                }
                targetTopicList.add(targetTopic);
                dataSourceList.remove(targetTopic);
            } else break;
        }
        return targetTopicList;
    }

}
