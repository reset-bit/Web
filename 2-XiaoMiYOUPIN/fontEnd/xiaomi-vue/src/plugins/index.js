// 函数式组件
import notice from './MiNotice';
import alert  from './MiAlert';
import confirm from './MiConfirm';
import loginAlert from './MiLoginAlert';

export default {
        install: function (Vue) {
                // Vue.prototype.$notice = notice;// 原始写法
                Vue.use(notice);
                Vue.use(alert);
                Vue.use(confirm);
                Vue.use(loginAlert);
        }
};