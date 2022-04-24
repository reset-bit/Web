import React from 'react';
import { Link } from 'react-router-dom';
import style from './CategoryRight.module.styl';

const CategoryRight  = ({ listSub, avatar }) => (
        <>
                <img src={avatar} className={style['sub-avatar']}/>
                <ul className={style['list-sub']}>
                        {listSub.map(item => (
                                <li key={item.id}>
                                        <Link to={`/list/${item.id}`}>
                                                <img src={item.avatar} alt=""/>
                                                <span>{item.name}</span>
                                        </Link>
                                </li>
                        ))}
                </ul>
        </>
);

export default CategoryRight;