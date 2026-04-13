export default {
        namespaced: true,
        state: {
                isInit: false,// 令地址仅初始化一次。不使用list!==null：用户可能原本没有地址
                list: []
        },
        getters: {

        },
        mutations: {
                _init(state, list) {
                        state.list = list;
                        state.isInit = true;
                },
                _remove(state, id) {
                        state.list.splice(state.list.findIndex(item => item.id === id), 1);
                },
                _add() {}
        },
        actions: {
                init({ state, commit, rootState: { http } }) {// 解构
                        if(state.isInit) return;
                        http({url: '/address/list'})
                                .then(list => commit('_init', list));// 将返回的数据赋值给state.list
                },
                remove({ rootState: { http }, commit }, id) {
                        return http({ url: '/address/remove', id })
                                .then(() => commit('_remove', id));
                },
                add() {

                }
        }
};