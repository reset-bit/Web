import http from '../utils/http.js';

const ActionTypes = {
        UPDATE_LIST_MAIN: 'UPDATE_LIST_MAIN',
        UPDATE_LIST_SUB: 'UPDATE_LIST_SUB'
};

export const actionCreator = {
        getListMain: () => async (dispatch, getState) => {
                try {
                        let listMain = await http('/category/list/0');
                        dispatch({ type: ActionTypes.UPDATE_LIST_MAIN, payload: listMain });
                        return listMain[0].id;
                } catch(e) {}
        },
        getListSub: id => async (dispatch, getState) => {
                try {
                        let listSub = await http('/category/list/' + id);
                        dispatch({ type: ActionTypes.UPDATE_LIST_SUB, payload: listSub });
                } catch(e) {}
        }
};

const initState = { listMain: [], listSub: [] };
const reducer = (state = initState, action = {}) => {
        let { type, payload } = action;
        switch(type) {
                case ActionTypes.UPDATE_LIST_MAIN:
                        return { ...state, listMain: [...payload] };
                case ActionTypes.UPDATE_LIST_SUB:
                        return { ...state, listSub: [...payload] };
                default:
                        return state;
        }
};

export default reducer;