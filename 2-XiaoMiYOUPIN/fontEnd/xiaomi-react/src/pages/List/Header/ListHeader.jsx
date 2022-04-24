import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import style from './ListHeader.module.styl';

const ListHeader = props => {
        return (
                <div className={style['header-content']}>
                        <div className={style['title']}>{props.listSub.find(item => item.id === props.cid).name}</div>
                        <ul className={style['header-list']}>
                                {props.listSub.map(item => (
                                        <li key={item.id}>
                                                <NavLink to={`/list/${item.id}`} activeClassName={style['active']}>
                                                        <img src={item.avatar} alt=""/>
                                                        <span>{item.name}</span>
                                                </NavLink>
                                        </li>
                                ))}
                        </ul>
                </div>
        );
};

const mapStateToProps = state => {
        return {
                listSub: state.category.listSub
        };
};
export default connect(mapStateToProps, null)(ListHeader);