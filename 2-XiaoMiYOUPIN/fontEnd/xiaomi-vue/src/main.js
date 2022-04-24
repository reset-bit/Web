import Vue from 'vue';
import router from './router';
import store from './store';
// 公共样式
import './assets/public.css';
import './assets/reset.css';
import './assets/font/iconfont.css';
// axios封装
import http from './utils/http.js';
Vue.prototype.$http  = http;
// 公共组件
import plugins from './plugins';
Vue.use(plugins);

new Vue({
        el: '#app',
        router,
        store,
        template: '<keep-alive include="List"><router-view /></keep-alive>'// 使用vue-router规定标签动态渲染
});