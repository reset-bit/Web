import React, { Component } from 'react';
import style from './Dialog.module.styl';
import ReactAddonsCssTransitionGroup from 'react-addons-css-transition-group';
import PropTypes from 'prop-types';

class Dialog extends Component {
        render() {
                return (
                        // style class值转码，将transitionName配置为对象形式。
                        // transitionEnterTimeout/transitionLeaveTimeout与styl文件中transition时长相同
                        <ReactAddonsCssTransitionGroup
                                transitionName={{
                                        enter: style['fade-enter'],
                                        enterActive: style['fade-enter-active'],
                                        leave: style['fade-leave'],
                                        leaveActive: style['fade-leave-active']
                                }}
                                transitionEnterTimeout={300}
                                transitionLeaveTimeout={300}
                        >
                                {/* 内容标签不能与外层标签同时渲染，故仿v-if */}
                                {this.props.isShow && (
                                        // 内容标签给定key值
                                        <div className={style['container']} key="container">
                                                <div className={style['content']}>
                                                        {this.props.children}
                                                </div>
                                        </div>
                                )}
                        </ReactAddonsCssTransitionGroup>
                );
        }
}
Dialog.propTypes = { isShow: PropTypes.bool.isRequired };

export default Dialog;