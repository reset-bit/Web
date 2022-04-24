import Vue from 'vue';
import Vuex from 'vuex';
import http from '../utils/http.js';
import func from './func.js';
import role from './role.js';
import classroom from './classroom.js';
import cls from './class.js';

Vue.use(Vuex);

export default new Vuex.Store({
        modules: { func, role, classroom, cls },
        state: { http }
});