export default {
        namespaced: true,
        state: {
                isInit: false,
                list: []
        },
        mutations: {
                _init(state, list) {
                        state.list = list;
                        state.isInit = true;
                },
                _add(state, cls) {
                        state.list.push(cls);
                },
                _update(state, cls) {
                        state.list.splice(state.list.findIndex(item => item.cls_id === cls.cls_id), 1, cls);
                }
        },
        actions: {
                async init({ state, commit, rootState: { http } }) {
                        if(state.isInit) return;
                        let list = await http({ url: '/class/all' });
                        commit('_init', list);
                },
                async add({ commit, rootState: { http } }, cls) {
                        cls.cls_id = await http({ method: 'post', url: '/class/add', data: cls });
                        commit('_add', cls);
                },
                async update({ commit, rootState: { http } }, cls) {
                        http({ method: 'post', url: '/class/update', data: cls });
                        commit('_update', cls);
                }
        }
};