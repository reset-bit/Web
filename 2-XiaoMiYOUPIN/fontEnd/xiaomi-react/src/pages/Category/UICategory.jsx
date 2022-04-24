import React from 'react';
import style from './UICategory.module.styl';
import MiNav from '../../components/MiNav';

const UICategory = props => (
        <div className={style['container']}>
                <div className={style['header']}></div>
                <div className={style['content']}>
                        <div className={style['left']}>
                                {props.children[0]}
                        </div>
                        <div className={style['right']}>
                                {props.children[1]}
                        </div>
                </div>
                <MiNav className={style['nav']}/>
        </div>
);

export default UICategory;