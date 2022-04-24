import Vue from 'vue';
import MiConfirm from './MiConfirm.vue';

let MiConfirmConstructor = Vue.extend(MiConfirm);// 将导入的配置转为构造函数

export default {
        install: function(Vue) {
                Vue.prototype.$confirm = function(text) {
                        // confirm不知道需要做什么，只负责显示数据，通过返回的promise对象判断到底要做什么。
                        return new Promise((resolve, reject) => {
                                let instance = new MiConfirmConstructor({ data: { text, resolve, reject } }).$mount();
                                document.body.appendChild(instance.$el);
                        });
                };
        }
};
