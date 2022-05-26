import style from './commonStyleSheet.less';
import {Empty, Skeleton, Spin} from 'antd';
import {FrownTwoTone, LoadingOutlined} from '@ant-design/icons';
import React from 'react';


// render loading placeholder, show msg in the middle area.
export const renderLoading = (msg, height) => (
  <div className={style.loading_wrapper} style={{height: height ?? null}}>
      <Spin size="large" indicator={<LoadingOutlined />} tip={msg ?? "加载中"} />
  </div>
);

export const skeleton = <Skeleton active />

// render empty placeholder, show msg in the middle area.
// selected option: height, if height is null, default is 50vh
export const myEmptyStatus = (msg, height) => {
  return <div className={style.row_in_middle_wrapper} style={{height: height ?? null}}>
    <Empty description={msg} />
  </div>
};

export const myPermissionDenied = (msg, height) => {
  return <div className={style.column_in_middle_wrapper} style={{height: height ?? null}}>
    <FrownTwoTone style={{fontSize: '48px', padding: '15px 0'}} />
    <div>{msg}</div>
  </div>
};
