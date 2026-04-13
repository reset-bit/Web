// 导出一个函数，实现动态创建并挂载MiNotice组件
import Vue from 'vue';
import MiNotice from './MiNotice.vue';// 导入组件配置

let MiNoticeConstructor = Vue.extend(MiNotice);// 基础vue构造器，创建一个子类，参数是包含组件选项的对象

// export default function(text) {
//         let instance = new MiNoticeConstructor({ data: { text: text } }).$mount();// 使用构造函数创建实例对象并挂载到dom
//         document.body.appendChild(instance.$el);// 渲染dom
// };
export default {
        // 可使用Vue.use
        install: function(Vue) {// 形参可替换外围Vue
                Vue.prototype.$notice = function(text) {
                        let instance = new MiNoticeConstructor({ data: { text: text } }).$mount();// 使用构造函数创建实例对象并挂载到dom
                        document.body.appendChild(instance.$el);// 渲染dom
                };
        }
};