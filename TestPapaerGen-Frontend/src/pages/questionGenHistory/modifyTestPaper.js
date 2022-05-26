import React from 'react';
import {
    Button,
    Checkbox,
    Input,
    Divider,
    Dropdown,
    Menu,
    Modal,
    Popconfirm,
    Popover,
    Select,
    Table,
    Upload, AutoComplete, Tooltip
} from "antd";
import {PlusCircleOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined, CheckOutlined, CloseOutlined, UndoOutlined} from '@ant-design/icons';
import moment from 'moment';
import style from '../questionBank/index.less';
import {connect} from "umi";
import {Option} from "antd/es/mentions";
import {getTopicType, searchQuestionByTopic, updateQuestionGenHistory} from "../../services/requestServices";
import {delay} from "../../utils/myUtils";
import {renderLoading, skeleton, skleton} from "../../layouts/commonComponents";

class ModifyTestPaper extends React.Component {
    // ES2015 构造函数
    test_paper_name;
    update_time;
    constructor(props) {
        // ES2015 让父类构造函数能初始化当前类
        super(props);
        this.state = {
            loading: false,
            questions: []
        }
    }

    // 根据test_paper_uid获取所有的Questions
    async getQuestions(test_paper_uid) {
        await this.setState({loading: true});
        // 根据试卷uid获取题目列表
        await this.props.dispatch({type: 'questionGenHistory/getQuestionGenHistoriesByTestPaperUid', payload: {test_paper_uid: test_paper_uid}});
        // 返回的结果
        await this.setState({questions: this.props.testPaperReportQuestionList?? []})
        await delay(1000)
        await this.setState({loading: false});
    }

    // 获取所有的题目类型
    async getTopicType() {
        const json = await getTopicType();
        await this.setState({topicType: json.data})
        await this.setState({selectedTopicType: this.state.topicType.length > 0 ? this.state.topicType[0] : ""})
    }

    // 搜索题目
    timer = null
    searchTopic = async value => {
        const asyncRequest = async () => {
            const payload = {keyword: "", topicType: "填空题"}
            const response = await searchQuestionByTopic(payload)
            response.data instanceof Array && this.setState({searchResult: response.data})
        }
        // 防抖请求
        if (this.timer) {
            clearTimeout(this.timer)
        }
        this.timer = setTimeout(asyncRequest, 1000)
    }

    // 删除按钮
    delBtn(index) {
        this.state.questions[index]["deleted_flag"] = true
        this.setState({questions: this.state.questions})
    }

    cancelDelBtn(index) {
        this.state.questions[index]["deleted_flag"] = false
        this.setState({questions: this.state.questions})
    }

    // 添加按钮 @params: index 在此下标后增加题目
    async addBtn(index) {
        this.state.questions.splice(index + 1, 0, {new_flag: true, create_done: false, index: Math.random()})
        await this.setState({questions: this.state.questions})
    }

    // 确定添加
     confirmAdd = (question, index) => {
        question["new_flag"] = true
        question["create_done"] = true
         question["question_bank_id"] = question.id
        this.state.questions[index] = question
        this.setState({questions: this.state.questions})
    }

    // 移除添加
    cancelAdd = (index) => {
        this.state.questions.splice(index, 1)
        this.setState({questions: this.state.questions})
    }

    // 保存试卷
    saveBtn = async () => {
        // 最终题目的id列表
        let ids = []
        for (let i = 0; i < this.state.questions.length; i++) {
            const item = this.state.questions[i]
            if (item.new_flag === true && item.create_done === false) {
                continue
            }
            if (item.deleted_flag !== true) {
                ids.push(item.question_bank_id)
            }
        }
        console.log(ids)
        let formData = new FormData()
        formData.append("test_paper_uid", this.props.record.test_paper_uid)
        formData.append("question_bank_id", ids)
        const response = await updateQuestionGenHistory(formData)
        await this.props.changeVisible()
    }

    componentDidMount() {
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (nextProps.visible === true && nextProps.visible !== this.props.visible) {
            // 显示了该页面
            this.getQuestions(nextProps.record.test_paper_uid).then()
            this.getTopicType().then()
        }
        return true
    }

    render() {
        // 循环渲染每一题
        const renderAllQuestion = () => {
            return this.state.questions.map((value, index) => {
                // 控制题目显示的样式
                const style = () => {
                    // 如果被删除了就显示删除线
                    if (value.deleted_flag && !value.new_flag) return {textDecoration: "line-through", color: "#AAA", borderLeft: "0.35rem solid #CCC"}
                    // 如果是新增的题目，就标绿
                    if (!value.deleted_flag && value.new_flag && value.create_done) return {borderLeft: "0.35rem solid #5cb85c"}
                }
                const delBtn = !value.deleted_flag ?
                    <Button onClick={this.delBtn.bind(this, index)} type="link" danger icon={<DeleteOutlined />}>{`删除`}</Button> :
                    <Button onClick={this.cancelDelBtn.bind(this, index)} type="link" icon={<UndoOutlined />}>{`恢复`}</Button>

                return (
                    <div key={index + 1}>
                        <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                            {
                                value.new_flag && !value.create_done ?
                                    <div style={{flexGrow: "1"}}>
                                        <SearchTopic index={index} onOk={this.confirmAdd} onCancel={this.cancelAdd} key={index}/>
                                    </div> :
                                    <p style={style()}>
                                        {index + 1}、（本题{value.score}分）{value.topic}
                                    </p>
                            }
                            {/*删除*/}
                            {
                                !value.new_flag ? delBtn : null
                            }
                        </div>
                        {/*添加*/}
                        <Divider dashed orientation="right">
                            <Button type="link" onClick={this.addBtn.bind(this, index)} icon={<PlusCircleOutlined />}>添加</Button>
                        </Divider>
                    </div>
                )
            })
        }

        return (
            <Modal title={`修改组卷 《${this.props.record?.test_paper_name}》`}
                   centered={true}
                   visible={this.props.visible}
                   onCancel={this.props.changeVisible}
                   footer={null}
                   width={'900px'}
                   destroyOnClose={true}
                   style={{}}
            >
                <div style={{marginBottom: "1rem", paddingRight: "3rem", display: "flex", alignItems: "center", justifyContent: "right"}}>
                    <Button onClick={this.props.changeVisible} type="primary" icon={<CloseCircleOutlined />} danger style={{margin: "0 10px"}}>放弃更改</Button>
                    <Button onClick={this.saveBtn} type="primary" icon={<CheckCircleOutlined />} style={{margin: "0 10px"}}>保存更改</Button>
                </div>
                {/*试卷显示 加点特效 阴影 不灵不灵*/}
                <article style={{width: "90%", margin: "0 auto", padding: "2.5rem", boxShadow: "0px 5px 10px 0px gray", backgroundColor: "white"}}>
                    <h1 style={{textAlign: "center", fontSize: "1.4rem"}}>{this.props.record?.test_paper_name}.docx</h1>
                    <p style={{fontSize: "0.75rem", color: "#888", textAlign: "right"}}>组卷时间：{moment(this.props.record?.update_time).format('YYYY-MM-DD HH:mm:ss')}</p>
                    <div style={{marginTop: "2rem"}}>
                        {this.state.loading ? skeleton : renderAllQuestion()}
                    </div>
                </article>

            </Modal>
        );
    }

}

function mapStateToProps({ questionGenHistory }) {
    const { testPaperGenHistories, testPaperReportQuestionList, reportDifficulty } = questionGenHistory;
    return { testPaperGenHistories, testPaperReportQuestionList, reportDifficulty };
}

export default connect(mapStateToProps)(ModifyTestPaper);


class SearchTopic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // 服务器返回的搜索结果
            searchResult: [],
            // 题目类型下拉
            topicType: [],
            selectedTopicType: "",
            // 选择候选题目
            selectedQuestion: null,
            // 不正确提示
            unCorrectMsg: false
        }
    }

    // 获取所有的题目类型
    fetchTopicType = async () => {
        const json = await getTopicType();
        await this.setState({topicType: json.data})
        // 默认选中的
        await this.setState({selectedTopicType: this.state.topicType.length > 0 ? this.state.topicType[0] : ""})
    }

    // 搜索题目 防抖
    timer = null
    searchTopic = async value => {
        const asyncRequest = async () => {
            const payload = {keyword: value, topicType: this.state.selectedTopicType}
            const response = await searchQuestionByTopic(payload)
            response.data instanceof Array && this.setState({searchResult: response.data})
        }
        if (this.timer) {
            clearTimeout(this.timer)
        }
        this.timer = setTimeout(asyncRequest, 1000)
    }

    // 立即搜索题目 不带防抖
    searchTopicNow = async () => {
        const payload = {keyword: "", topicType: this.state.selectedTopicType}
        const response = await searchQuestionByTopic(payload)
        response.data instanceof Array && this.setState({searchResult: response.data})
    }

    // 选择候选题目
    onSelect = async (value, option) => {
        await this.setState({selectedQuestion: option.question})
    }

    // 确定按钮
    onOk = async () => {
        if (this.state.selectedQuestion !== null) {
            // 传题目对象 + 题目序号给上层组件
            this.props.onOk(this.state.selectedQuestion, this.props.index)
        } else {
            await this.setState({unCorrectMsg: true})
            await delay(5000);
            await this.setState({unCorrectMsg: false})
        }
    }

    componentDidMount() {
        this.fetchTopicType().then()
    }

    render() {
        // 题目类型选择框
        const options_1 = this.state.topicType.map(value => <Select.Option key={value}>{value}</Select.Option>)
        const changeSelectedValue = value => this.setState({selectedTopicType: value})
        // 搜索结果
        const options_2 = this.state.searchResult.map((value, index) => {
            return {question: value, topicIndex: this.props.index, value: `（本题${value.score}分）${value.topic}`, label: `${value.topic}`}
        })

        return <div style={{display: "flex", flexWrap: "nowrap"}}>
            <span>{`${this.props.index + 1}、`}</span>
            <Select value={this.state.selectedTopicType} onChange={changeSelectedValue} style={{ width: '20%', marginRight: "5px" }}>
                {options_1}
            </Select>
            <Tooltip title="输入的题目不正确" visible={this.state.unCorrectMsg}>
                <AutoComplete
                    style={{ width: '80%' }}
                    options={options_2}
                    allowClear={true}
                    placeholder="输入文字查找题目..."
                    onClick={this.searchTopicNow} // 点击就显示搜索结果
                    onChange={this.searchTopic}
                    onSelect={this.onSelect}
                    status={this.state.unCorrectMsg ? "error" : null}
                />
            </Tooltip>
            <Button onClick={this.onOk} type="primary" style={{ marginLeft: "5px" }} icon={<CheckOutlined />}></Button>
            <Button onClick={this.props.onCancel.bind(this, this.props.index)} type="danger" style={{ marginLeft: "5px" }} icon={<CloseOutlined />}></Button>
        </div>
    }
}