import React from 'react';
import style from './UIList.module.styl';

const UIList = props => (
        <div className={style['container']}>
                <div className={style['header']}>{props.children[0]}</div>
                <div className={style['sort']}>{props.children[1]}</div>
                <div className={style['content']}>{props.children[2]}</div>
        </div>
);

export default UIList;