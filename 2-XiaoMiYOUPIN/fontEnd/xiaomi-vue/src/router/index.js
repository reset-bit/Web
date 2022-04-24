import Vue from 'vue';
import VueRouter from 'vue-router';
// // 导入自定义组件
// import Home from '../views/Home';
// import Category from '../views/Category';
// import Cart from '../views/Cart';
// import Profile from '../views/Profile';
// import Login from '../views/Login';
// import List from '../views/List';

Vue.use(VueRouter);

// 自定义配置路由地图
let router =  new VueRouter({
        linkActiveClass: 'active',
        routes: [
                { path: '/', redirect: '/home' },
                // { path: '/home', component: Home },
                { path: '/home', component: () => import('../views/Home') },// 懒加载组件
                { path: '/category', component: () => import('../views/Category') },
                { path: '/cart', component: () => import('../views/Cart') },
                { path: '/profile', component: () => import('../views/Profile') },
                { path: '/login', component: () => import('../views/Login') },
                { path: '/list/:cid/:title/:fid', component: () => import('../views/List') },
                { path: '/address', meta: { needAuth: true }, component: () => import('../views/AddressTrue') }// 需要验证登录
        ]
});

export default router;