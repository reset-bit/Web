import Vue from 'vue';
import MiAlert from './MiAlert.vue';

let MiAlertConstructor = Vue.extend(MiAlert);

export default {
        install: function(Vue) {
                Vue.prototype.$alert = function(text) {
                        let instance = new MiAlertConstructor({ data: { text } }).$mount();
                        document.body.appendChild(instance.$el);
                };
        }
};