import React from 'react';

const UILogin = props => (
        <div>
                <h1>登录</h1>
                {/* props.children包含2个组件，同时渲染 */}
                {props.children}
        </div>
);

export default UILogin;