import React from 'react';
import context from '../context.js';
import {connect} from 'react-redux';
import style from './CategoryLeft.module.styl';

const CategoryLeft =  props => (
        <context.Consumer>
                {({ activeId, toggleActiveId }) => (
                        <ul className={style['list-main']}>
                                {props.listMain.map(item => (
                                        <li key={item.id} onClick={() => toggleActiveId(item.id)}>
                                                <span style={{ color: activeId === item.id ? 'red' : 'black'}}>{item.name}</span>
                                        </li>
                                ))}
                        </ul>
                )}
        </context.Consumer>
);

const mapStateToProps = (state, props) => {
        return {
                listMain: state.category.listMain
        };
};

export default connect(mapStateToProps, null)(CategoryLeft);