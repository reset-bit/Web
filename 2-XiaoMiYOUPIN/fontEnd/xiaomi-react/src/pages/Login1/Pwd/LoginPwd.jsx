import React, { Component } from 'react';
import http from '../../../utils/http.js';

class LoginPwd extends Component {
        state = {
                name: '',
                pwd: ''
        };
        render() {
                return (
                        <div>
                                <input type="text" placeholder='请输入用户名' value={this.state.name}
                                       onInput={e => this.setState({ name: e.target.value.trim() })}/>
                                <input type="password" placeholder='请输入密码' value={this.state.pwd}
                                       onInput={e => this.setState({ pwd: e.target.value })}/>
                                <button onClick={this.login}>登录</button>
                        </div>
                );
        }
        login= async () => {
                try {
                        let token = await http('/user/login_pwd', { method: 'post', body: this.state });
                        sessionStorage.setItem('token', token);
                        sessionStorage.setItem('name', this.state.name);
                        this.props.history.replace(this.props.location.state.from || '/home');// 跳转初衷页面
                } catch(e) {}
        };
}

export default LoginPwd;