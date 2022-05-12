package com.teemo.testpapergeneration.services;

import com.teemo.testpapergeneration.entity.QuestionBank;
import com.teemo.testpapergeneration.mapper.QuestionBankMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UpdateQuestionLibrary {

    @Autowired
    QuestionBankMapper questionBankMapper;

    public static int run(List<QuestionBank> list) {
        return 0;
    }

}
