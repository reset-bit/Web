import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { categoryActions } from '../../store';
import UICategory from './UICategory.jsx';
import CategoryLeft from './Left/CategoryLeft.jsx';
import CategoryRight from './Right/CategoryRight.jsx';

const Category = props => {
        let isMounting = useRef(true);
        const [activeId, setActiveId] = useState(0);
        useEffect(async () => {
                let id = await props.getListMain();
                setActiveId(id);
        }, []);
        useEffect(async () => {
                // 防止刚显示页面、一级分类尚未获取到时执行本函数
                if(isMounting.current) { return; }
                props.getListSub(activeId);
        }, [activeId]);
        // 在所有useEffect都结束之后更改值，a更新2次后return内dom获取正常
        // 初始化未执行清除副作用函数；点击按钮dom更新一次，之后执行清除副作用函数来更新；再次点击按钮dom成功获取到上一次更新后的值
        useEffect(() => {
                return () => { isMounting.current = false; };
        }, [activeId]);

        let leftProps = {
                listMain: props.listMain,
                activeId: activeId,
                toggleActiveId: setActiveId
        };
        let rightProps = {
                listSub: props.listSub,
                avatar: activeId > 0 ? props.listMain.find(item => item.id === activeId).avatar : ''
        };
        return (
                <UICategory>
                        <CategoryLeft {...leftProps}/>
                        <CategoryRight {...rightProps}/>
                </UICategory>
        );
};

const mapStateToProps = state => {
        return {
                listMain: state.category.listMain,
                listSub: state.category.listSub
        };
};
const mapDispatchToProps = dispatch => {
        return {
                getListMain: () => dispatch(categoryActions.getListMain()),
                getListSub: id => dispatch(categoryActions.getListSub(id))
        };
};

export default connect(mapStateToProps, mapDispatchToProps)(Category);