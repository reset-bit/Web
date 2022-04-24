import http from '@/utils/http.js';

export const actionCreator = {
        init: () => async (dispatch, getState) => {
                let list = await http('/cart/list', {method: 'post'});
                dispatch({ type: 'CART_INIT', payload: list });
        },
        decrease: id => async (dispatch, getState) => {
                await http('/cart/decrease/' + id, {method: 'post'});
                dispatch({ type: 'CART_DECREASE', payload: id });
        },
        increase: id => async (dispatch, getState) => {
                await http('/cart/increase/' + id, {method: 'post'});
                dispatch({ type: 'CART_INCREASE', payload: id });
        },
        remove: id => async (dispatch, getState) => {
                await http('/cart/remove/' + id, {method: 'post'});
                dispatch({ type: 'CART_REMOVE', payload: id });
        },
        toggle: id => ({ type: 'CART_TOGGLE', payload: id }),
        toggleEdit: id => ({ type: 'CART_TOGGLE_EDIT', payload: id }),
        toggleAll: status => ({ type: 'CART_TOGGLE_ALL', payload: status }),
        toggleEditAll: status => ({ type: 'CART_TOGGLE_EDIT_ALL', payload: status })
};

export default (state, action = {}) => {
        let {type, payload} = action;
        let pos = null;
        switch(type) {
                case 'CART_INIT':// 动态开辟两个属性，用以分别存放结算和编辑状态的checkbox状态
                        payload.forEach(item => {
                                item.checked = true;
                                item.checkedEdit = false;
                        });
                        return { list: payload };
                case 'CART_INCREASE':
                        state.list.find(item => item.id === payload).count--;
                        return { list: [...state.list] };
                case 'CART_DECREASE':
                        state.list.find(item => item.id === payload).count++;
                        return { list: [...state.list] };
                case 'CART_REMOVE':
                        state.list.splice(state.list.findIndex(item => item.id === payload), 1);
                        return { list: [...state.list] };
                case 'CART_TOGGLE':
                        pos = state.list.findIndex(item => item.id === payload);
                        state.list[pos].checked = !state.list[pos].checked;
                        return { list: [...state.list] };
                case 'CASE_TOGGLE_EDIT':
                        pos = state.list.findIndex(item => item.id === payload);
                        state.list[pos].checkedEdit = !state.list[pos].checkedEdit;
                        return { list: [...state.list] };
                case 'CART_TOGGLE_ALL':// payload为目标切换的checkbox状态
                        state.list.forEach(item => item.checked = payload);
                        return { list: [...state.list] };
                case 'CART_TOGGLE_EDIT_ALL':
                        state.list.forEach(item => item.checkedEdit = payload);
                        return { list: [...state.list] };
                default:
                        return state;
        }
};
