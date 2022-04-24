import React, { useState, useEffect, useRef } from 'react';
import UIList from './UIList.jsx';
import ListHeader from './Header/ListHeader.jsx';
import ListSort from './Sort/ListSort.jsx';
import ListContent from './Content/ListContent.jsx';
import http from '@/utils/http.js';

const List = props => {
        const [orderCol, setOrderCol] = useState('price');
        const [orderDir, setOrderDir] = useState('asc');
        let contentRef = useRef();

        // 与加载更多平行分支
        // useEffect不能修改依赖数据，否则会造成死循环
        useEffect(async () => {
                let list = await getList();
                contentRef.current.updateList(list);
        }, [orderCol, orderDir, props.match.params.cid]);

        const changeOrder = col => {
                if(col === orderCol) {
                        setOrderDir(orderDir === 'asc' ? 'desc' : 'asc');
                } else {
                        setOrderCol(col);
                }
        };
        const getList = (begin = 0) => {
                return http('/product/list', {
                        method: 'post',
                        body: {
                                orderCol, orderDir, name: '', cid: parseInt(props.match.params.cid), pageSize: 6, begin
                        }
                });
        };
        let headerProps = { cid: parseInt(props.match.params.cid) };
        let sortProps = { orderCol, orderDir, changeOrder };
        return (
                <UIList>
                        <ListHeader {...headerProps}/>
                        <ListSort {...sortProps}/>
                        <ListContent ref={contentRef} getList={getList}/>
                </UIList>
        );
};

export default List;