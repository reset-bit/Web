import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import cart from './cart.js';
import address, { actionCreator as addressActions } from './address.js';// 名别名
import category, { actionCreator as categoryActions } from './category.js';
export { addressActions, categoryActions };// 非键值对简写，统一导入导出子仓库actionCreators

/**
 * 纯函数
 * @param state 上次返回的state数据
 * @param action 含type属性用于对标操作，其他属性用于传递数据
 * */
// const reducer = (state = {}, action = {}) => {
//         // state = {
//         //         address: { list: [], isInit: false },
//         //         cart: { list: [], isInit: false }
//         // }
//         return {
//                 address: addressReducer(state.address, action),
//                 cart: cartReducer(state.cart, action),
//                 category: categoryReducer(state.category, action)
//         };
// };
const reducer = combineReducers({ cart, address, category });

// 接收一个reducer函数，该函数应当返回一个对象作为存储的数据
const store = createStore(reducer, compose(applyMiddleware(thunk),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()));// ori-reducer，每次组件内dispatch都会调用reducer，据此修改子仓库数据
export default store;