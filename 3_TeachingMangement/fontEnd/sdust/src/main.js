import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import http from './utils/http.js';

import './assets/reset.css';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.prototype.$http = http;
Vue.use(ElementUI);

new Vue({
        router,
        store,
        render: h => h(App)
}).$mount('#app');// runtime-vue
