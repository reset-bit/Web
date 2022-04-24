import React, { Component } from 'react';
import context from './context.js';
import { connect } from 'react-redux';
import { categoryActions } from '../../store';
import UICategory from './UICategory.jsx';

// listMain与listSub由后代自行调取，但需要提供方法修改（可不在此提供方法，此方案需要后代容器组件自行提供）
// listMain只需要在初始化时获取，listSub需要在CategoryLeft点击不同子项=>修改activeId时修改
// activeId与修改activeId的方法
class Category extends Component {
        state = {
                activeId: 0
        };
        toggleActiveId = id => {
                if(this.state.activeId === id) return;
                this.setState({activeId:id});
                this.props.getListSub(id);
        };
        async componentDidMount() {
                // 已在仓库try
                let id = await this.props.getListMain();// await 可取promise内携带的值
                this.setState({activeId: id});
                this.props.getListSub(id);
        }
        render() {
                let contextData = {
                        activeId: this.state.activeId,
                        toggleActiveId: this.toggleActiveId,
                        getListMain: this.props.getListMain,
                        getListSub: this.props.getListSub
                };
                return (
                        <context.Provider value={contextData}>
                                <UICategory />
                        </context.Provider>
                );
        }
}

const mapDispatchToProps = dispatch => {
        return {
                getListMain: () => dispatch(categoryActions.getListMain()),// 返回promise
                getListSub: id => dispatch(categoryActions.getListSub(id))
        };
};

export default connect(null, mapDispatchToProps)(Category);