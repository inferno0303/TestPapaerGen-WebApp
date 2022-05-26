import React from "react";
import {Spin} from "antd";
import { LoadingOutlined } from '@ant-design/icons';

export default () => {
    const spin = <Spin size="large" indicator={<LoadingOutlined />} tip="页面加载中..." />
    // return <div style={{height: "50vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontSize: "2rem", color: "#CCC"}}>加载中...</div>
    return <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: "40vh"}}>
        {
            spin
        }
    </div>
}