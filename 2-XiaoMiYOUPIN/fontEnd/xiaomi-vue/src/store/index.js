// 创建mall对象并导出
import Vue from 'vue';
import Vuex from 'vuex';
import http from '../utils/http.js';
import address from './address.js';
import addressTrue from './addressTrue.js';

Vue.use(Vuex);

const store = new Vuex.Store({
        modules: {
                address,
                addressTrue
        },
        state: {
                key: 100,
                http
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
                        console.log('actions-changeKey');
                        console.log(context.state);
                        console.log(context.getters['keyPlus']);
                        context.commit('changeKey', key);
                        context.dispatch('test');
                },
                test(context) {
                        console.log('action-context');
                }
        }
});

export default store;