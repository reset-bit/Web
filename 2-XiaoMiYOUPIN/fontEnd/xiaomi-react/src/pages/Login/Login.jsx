import React, { useState } from 'react';
import UILogin from './UILogin.jsx';
import LoginPwd from './Pwd/LoginPwd.jsx';
import LoginPhone from './Phone/LoginPhone.jsx';
import LoginButton from './Button/LoginButton.jsx';
import http from '@/utils/http.js';
import { Alert } from '@/components/Message';

const Login = props => {
        const [mode, setMode] = useState(true);
        const toggleMode = () => setMode(!mode);
        const loginPwd = async (model) => {
                try {
                        let token = await http('/user/login_pwd', { method: 'post', body: model });
                        sessionStorage.setItem('token', token);
                        sessionStorage.setItem('name', model.name);
                        // 跳转初衷页面，没有初衷页面location.state将为undefined
                        props.history.replace(props.location.state ? props.location.state.from : '/home');
                } catch(e) {}
        };
        const loginPhone = () => { Alert('暂时不支持此功能'); };
        return (
                // 使用子组件插槽实现【组合】：降低子组件UILogin复杂度，将业务逻辑向顶层收缩
                <UILogin>
                        {mode ? (
                                <LoginPwd login={loginPwd}/>
                        ) : (
                                <LoginPhone login={loginPhone}/>
                        )}
                        <LoginButton onClick={toggleMode}>
                                {mode ? '手机号密码登录' : '用户名密码登录'}
                        </LoginButton>
                </UILogin>
        );
};

export default Login;