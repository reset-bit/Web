export default {
        namespaced: true,
        state: {
                isInit: false,
                list: []
        },
        getters: {
                treeOfList(state) {
                        let res = [{ func_id: 0, func_name: 'Root', func_key: '', func_fid: -1, is_show: false, children: [] }];
                        let tmp = null, child = null;
                        state.list.filter(item => item.func_fid === 0).forEach(item => {
                                tmp = { ...item, is_show: false };
                                child = state.list.filter(item1 => item1.func_fid === item.func_id);
                                if(child.length > 0) {
                                        tmp.children = [];
                                        child.forEach(item2 => tmp.children.push({...item2, is_show: false}));
                                }
                                res[0].children.push(tmp);
                        });
                        return res;
                }
        },
        mutations: {
                _init(state, list) {
                        state.list = list;
                        state.isInit = true;
                },
                _remove(state, func_id) {
                        state.list.splice(state.list.findIndex(item => item.func_id === func_id), 1);
                },
                _add(state, func) {
                        state.list.push(func);
                },
                _update(state, func) {
                        state.list.splice(state.list.findIndex(item => item.func_id === func.func_id), 1, func);
                }
        },
        actions: {
                async init({ state, commit, rootState: { http } }) {
                        if(state.isInit) return;
                        let list = await http({ url: '/function/all' });
                        commit('_init', list);
                },
                async remove({ commit, rootState: { http } }, func_id) {
                        http({ method: 'post', url: '/function/remove/' + func_id });
                        commit('_remove', func_id);
                },
                async add({ commit, rootState: { http } }, func) {
                        func.func_id = await http({ method: 'post', url: '/function/add', data: func });
                        commit('_add', func);
                },
                async update({ commit, rootState: { http } }, func) {
                        http({ method: 'post', url: '/function/update', data: func });
                        commit('_update', func);
                }
        }
};