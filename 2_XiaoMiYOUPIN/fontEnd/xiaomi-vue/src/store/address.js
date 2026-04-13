export default {
        namespaced: true,
        state: {
                key: 200
        },
        getters: {
                keyPlus(state) { return state.key + 1; }
        },
        mutations: {
                changeKey(state, key) {
                        state.key = key;
                }
        },
        actions: {
                changeKey(context, key) {
                        console.log('modules-actions-changeKey');
                        console.log('modules key:' + context.state.key);
                        context.commit('changeKey', key);
                        context.dispatch('test');
                },
                test(context) {
                        console.log('root key:' + context.rootState.key);
                },
        }
};