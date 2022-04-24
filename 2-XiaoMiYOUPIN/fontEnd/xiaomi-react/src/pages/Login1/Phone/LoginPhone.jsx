import React from 'react';

export default () => (
        <div>
                <input type="text" placeholder='请输入手机号'/>
                <input type="password" placeholder='请输入密码'/>
                <button onClick={() => {alert('暂不支持此功能');}}>登录</button>
        </div>
);