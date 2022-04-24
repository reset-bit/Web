import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';

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
        login= () => {
                fetch('/user/login_pwd', {
                        method: 'post',
                        body: JSON.stringify(this.state),
                        headers: { 'Content-Type': 'application/json' }
                })
                        .then(response => {
                                if(response.status === 200) return response.json();
                                else throw new Error(response.statusText);
                        })
                        .then(({ code, data, msg }) => {
                                switch(code) {
                                        case 200:
                                                sessionStorage.setItem('token', data);
                                                sessionStorage.setItem('name', this.state.name);
                                                this.props.history.replace('/home');
                                                break;
                                        case 199:
                                        case 401:
                                        case 404:
                                        case 500:
                                                throw new Error(msg);
                                }
                        })
                        .catch(error => console.log(error.message));
        };
}

export default LoginPwd;