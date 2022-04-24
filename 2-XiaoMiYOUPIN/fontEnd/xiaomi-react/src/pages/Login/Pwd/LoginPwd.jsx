import React, { useState } from 'react';

// 更精简的函数式组件
const LoginPwd = props => {
        const [name, setName] = useState('');
        const [pwd, setPwd] = useState('');
        return (
                <div>
                        <input type="text" placeholder='请输入用户名' value={name}
                               onInput={e => setName(e.target.value.trim())}/>
                        <input type="password" placeholder='请输入密码' value={pwd}
                               onInput={e => setPwd(e.target.value)}/>
                        <button onClick={() => props.login({ name, pwd })}>登录</button>
                </div>
        );
};

export default LoginPwd;