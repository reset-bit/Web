import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);
// 定义路由
const routes = [
        { path: '/', redirect: '/login' },
        { path: '/login', component: () => import('../pages/Login') },
        { path: '/home', component: () => import('../pages/Home'), meta: { needAuth: true } }
];
// 创建router实例
const router = new VueRouter({
        linkActiveClass: 'active',
        routes
});
router.beforeEach((to, from, next) => {
        if(to.meta.needAuth && !sessionStorage.getItem('token')) {
                next('/login');
        } else {
                next();
        }
});

export default router;