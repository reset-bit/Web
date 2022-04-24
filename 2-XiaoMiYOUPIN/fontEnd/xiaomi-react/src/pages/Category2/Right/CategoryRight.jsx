import React from 'react';
import { Link } from 'react-router-dom';
import context from '../context.js';
import { connect } from 'react-redux';
import style from './CategoryRight.module.styl';

const CategoryRight  = props => (
        <context.Consumer>
                {({ activeId }) => {
                        let avatar = activeId === 0 ? '' : props.listMain.find(item => item.id === activeId).avatar;
                        return (
                                <>
                                        <img src={avatar} className={style['sub-avatar']}/>
                                        <ul className={style['list-sub']}>
                                                {props.listSub.map(item => (
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
                }}
        </context.Consumer>
);

const mapStateToProps = (state, props) => {
        return {
                listMain: state.category.listMain,
                listSub: state.category.listSub
        };
};
export default connect(mapStateToProps, null)(CategoryRight);