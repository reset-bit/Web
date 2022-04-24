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
                _remove(state, clsr_id) {
                        state.list.splice(state.list.findIndex(item => item.clsr_id === clsr_id), 1);
                },
                _add(state, classroom) {
                        state.list.push(classroom);
                },
                _update(state, classroom) {
                        state.list.splice(state.list.findIndex(item => item.clsr_id === classroom.clsr_id), 1, classroom);
                }
        },
        actions: {
                async init({ state, commit, rootState: { http } }) {
                        if(state.isInit) return;
                        let list = await http({ url: '/classroom/all' });
                        commit('_init', list);
                },
                async reInit({ commit, rootState: { http } }) {
                        let list = await http({ url: '/classroom/all' });
                        commit('_init', list);
                },
                async remove({ commit, rootState: { http } }, clsr_id) {
                        http({ url: '/classroom/remove/' + clsr_id });
                        commit('_remove', clsr_id);
                },
                async add({ commit, rootState: { http } }, classroom) {
                        classroom.clsr_id = await http({ method: 'post', url: '/classroom/add', data: { clsr_name: classroom.clsr_name } });
                        classroom.clsr_occupy = 0;
                        commit('_add', classroom);
                },
                async update({ commit, rootState: { http } }, classroom) {
                        http({ method: 'post', url: '/classroom/update', data: classroom });
                        commit('_update', classroom);
                }
        }
};