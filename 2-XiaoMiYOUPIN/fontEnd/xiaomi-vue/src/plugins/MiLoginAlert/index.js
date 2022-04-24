import Vue from 'vue';
import MiLoginAlert from './MiLoginAlert.vue';

let MiLoginAlertConstuctor = Vue.extend(MiLoginAlert);

export default {
        install: function(Vue) {
                Vue.prototype.$loginAlert = function(text) {
                        let instance = new MiLoginAlertConstuctor().$mount();
                        document.body.appendChild(instance.$el);
                };
        }
};