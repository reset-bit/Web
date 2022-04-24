import React from 'react';
import style from './UICategory.module.styl';
import MiNav from '../../components/MiNav';
import CategoryLeft from './Left/CategoryLeft.jsx';
import CategoryRight from './Right/CategoryRight';

const UICategory = () => (
        <div className={style['container']}>
                <div className={style['header']}></div>
                <div className={style['content']}>
                        <div className={style['left']}>
                                <CategoryLeft />
                        </div>
                        <div className={style['right']}>
                                <CategoryRight />
                        </div>
                </div>
                <MiNav className={style['nav']}/>
        </div>
);

export default UICategory;