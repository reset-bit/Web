import http from '../utils/http.js';
// 枚举命名Pascal命名法，键名全大写需互斥，键值随意但建议具说明性
const ActionTypes = {
        ADDRESS_INIT: 'ADDRESS_INIT',
        ADDRESS_ADD: 'ADDRESS_ADD',
        ADDRESS_REMOVE: 'ADDRESS_REMOVE',
        ADDRESS_UPDATE: 'ADDRESS_UPDATE',
        ADDRESS_SETDEFAULT: 'ADDRESS_SETDEFAULT'
};

// 命名可小写。actionCreator执行后返回action对象，让组件不必关心action对象的具体创建，只需调用相应的creator函数即可。
// actions.type仅应当面向address子仓库，所以抽象actionCreator解耦
export const actionCreator = {
        // 闭包，柯里化将参数延迟到dispatch执行。async函数将作为dispatch参数，在该函数内调用dispatch。同步函数返回action
        // 或许在dispatch中执行了一次async
        init: () => async (dispatch, getState) => {
                let { address: {isInit} } = getState();
                if(isInit) return;
                try {
                        let list = await http('/address/list');
                        dispatch({ type: ActionTypes.ADDRESS_INIT, payload: list });
                } catch(e) {}
        },
        add: address => async dispatch => {
                try {
                        address.id = await http('/address/add', { method: 'post', body: address });
                        dispatch({ type: ActionTypes.ADDRESS_ADD, payload: {...address} });
                } catch(e) {}
        },
        remove: id => async dispatch => {
                try {
                        await http('/address/remove/' + id);
                        dispatch({ type: ActionTypes.ADDRESS_REMOVE, payload: id });
                } catch(e) {}
        },
        update: address => async dispatch => {
                try {
                        await http('/address/update', { method: 'post', body: address });
                        dispatch({ type: ActionTypes.ADDRESS_UPDATE, payload: {...address} });
                } catch(e) {}
        },
        setDefault: id => async dispatch => {
                try {
                        await http('/address/set_default/' + id);
                        dispatch({ type: ActionTypes.ADDRESS_SETDEFAULT, payload: id });
                } catch(e) {}
        }
        // init: payload => ({ type: ActionTypes.ADDRESS_INIT, payload }),
        // add: payload => ({ type: ActionTypes.ADDRESS_ADD, payload }),
        // remove: payload => ({ type: ActionTypes.ADDRESS_REMOVE, payload }),
        // update: payload => ({ type: ActionTypes.ADDRESS_UPDATE, payload }),
        // setDefault: payload => ({ type: ActionTypes.ADDRESS_SETDEFAULT, payload })
};

const initState = { list: [], isInit: false };
// 纯函数，设置参数默认值当做仓库初始值，注意第二参数必须为action
const reducer = (state = initState, action = {}) => {
        let { type, payload } = action;
        // 未命中证明路由错误或首次数据初始化，应当返回原有值
        // 应当重新复制一份数据，将setState转为return
        let list = null;
        switch(type) {
                case ActionTypes.ADDRESS_INIT:
                        return { list: payload, isInit: true };
                case ActionTypes.ADDRESS_ADD:
                        return { ...state, list: [...state.list, payload] };
                case ActionTypes.ADDRESS_REMOVE:
                        list = [...state.list];
                        list.splice(list.findIndex(item => item.id === payload), 1);
                        return { ...state, list };
                case ActionTypes.ADDRESS_UPDATE:
                        list = [...state.list];
                        list.splice(list.findIndex(item => item.id === payload.id), 1, payload);
                        return { ...state, list };
                case ActionTypes.ADDRESS_SETDEFAULT:
                        list = [...state.list];
                        list.forEach(item => item.isDefault = item.id === payload ? 1 : 0);
                        return { ...state, list };
                default:
                        return state;
        }
};

export default reducer;