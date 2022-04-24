import React from 'react';
import style from './CategoryLeft.module.styl';

const CategoryLeft = ({ listMain, activeId, toggleActiveId }) => (
        <ul className={style['list-main']}>
                {listMain.map(item => (
                        <li key={item.id} onClick={() => toggleActiveId(item.id)}>
                                <span style={{ color: activeId === item.id ? 'red' : 'black'}}>{item.name}</span>
                        </li>
                ))}
        </ul>
);

export default CategoryLeft;