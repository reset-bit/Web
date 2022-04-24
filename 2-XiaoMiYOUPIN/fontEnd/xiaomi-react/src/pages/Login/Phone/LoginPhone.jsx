import React, { useState } from 'react';

const LoginPhone = props => {
        const [phone, setPhone] = useState('');
        const [pwd, setPwd] = useState('');
        return (
                <div>
                        <input type="text" placeholder='请输入手机号'
                               value={phone} onInput={e => setPhone(e.target.value.trim())}/>
                        <input type="password" placeholder='请输入密码'
                               value={pwd} onInput={e => setPwd(e.target.value.trim())}/>
                        <button onClick={() => props.login()}>登录</button>
                </div>
        );
};

export default LoginPhone;