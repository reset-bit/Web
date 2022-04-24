import React, { useState, useEffect, useMemo } from 'react';
import { useThunkReducer } from 'react-hook-thunk-reducer';
import reducer, { actionCreator as cartActions } from './cartReducer.js';

const Cart  = () => {
        const [state, dispatch] = useThunkReducer(reducer, {list:[]});
        const [mode, setMode] = useState(false);// 标识进入编辑模式
        useEffect(() => {
                dispatch(cartActions.init());
        }, []);
        let isBuyAll = useMemo(() => {
                return state.list.every(item => item.checked1);
        }, [state.list]);
        let isEditAll = useMemo(() => {
                return state.list.every(item => item.checked2);
        }, [state.list]);
        let total = useMemo(() => {
                let sum = 0;
                state.list.forEach(item => {
                        if(item.checked1) {
                                sum += item.price * item.count;
                        }
                });
                return sum;
        }, [state.list]);
        return (
                <div>
                        <button onClick={() => setMode(!mode)}>{mode ? '完成' : '编辑'}</button>
                        <ul>
                                {state.list.map(item => (
                                        <li key={item.id}>
                                                {/*<img src={item.avatar} alt=""/>*/}
                                                <input type="checkbox" style={{display: mode ? 'none' : 'block'}}
                                                       checked={item.checked1} onChange={() => dispatch(cartActions.toggle(item.id))}/>
                                                <input type="checkbox" style={{display: mode ? 'block' : 'none'}}
                                                       checked={item.checked2} onChange={() => dispatch(cartActions.toggleEdit(item.id))}/>
                                                <p>{item.name}</p>
                                                <span>{item.price}</span>
                                                <p>合计：{item.price * item.count}</p>
                                                <div>
                                                        <button disabled={item.count === 1} onClick={cartActions.decrease(item.id)}>-</button>
                                                        <span>{item.count}</span>
                                                        <button disabled={item.count === 5} onClick={cartActions.increase(item.id)}>+</button>
                                                </div>
                                        </li>
                                ))}
                        </ul>
                        <div style={{display: mode ? 'none' : 'block'}}>
                                <hr/>
                                <input type="checkbox" checked={isBuyAll}
                                       onChange={() => dispatch(cartActions.toggleAll(!isBuyAll))}/>全选/全不选
                                <span>合计：{total}</span>
                                <button>结算</button>
                        </div>
                        <div style={{display: mode ? 'block' : 'none'}}>
                                <hr/>
                                <input type="checkbox" checked={isEditAll}
                                       onChange={() => dispatch(cartActions.toggleAll(!isEditAll))}/>全选/全不选
                                <button>删除</button>
                        </div>
                </div>
        );
};

export default Cart;