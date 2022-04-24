import React from 'react';
import style from './LoginButton.module.styl';

const LoginButton = props => (
        <button className={style['my-button']} onClick={props.onClick}>{props.children}</button>
);

export default LoginButton;