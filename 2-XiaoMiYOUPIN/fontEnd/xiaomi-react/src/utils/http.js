import fetch from 'isomorphic-fetch';
import history from '../router';
import { Loading } from '@/components/Message';

export default (url, userOptions = {}, withLoading = true) => {// 加强版loading效果
        let defaultHeaders = {
                'Content-Type': 'application/json',
                'Authorization': sessionStorage.getItem('token')
        };
        userOptions.headers = Object.assign({}, defaultHeaders, userOptions.headers || {});
        userOptions.body && (userOptions.body = JSON.stringify(userOptions.body));
        withLoading && Loading.open();
        // 发ajax
        return fetch(url, userOptions)
                .then(response => {
                        // fetch在此永不报错，可解决多个http同时发送弹出多个loading，但不能解决await相互分离的多个loading
                        // 建议：loading.open(); http(); http(); loading.close();
                        withLoading && setTimeout(() =>Loading.close(), 500);
                        if(response.status === 200) {
                                return response.json();
                        } else {
                                throw new Error(response.statusText);
                        }
                })
                .then(({code, data, msg}) => {
                        switch(code) {
                                case 200:
                                        return data;
                                case 401:
                                        // 登录验证
                                        // 需要清除缓存，否则给服务器发送过期token之后才会被拦截，增加服务器压力
                                        sessionStorage.removeItem('token');
                                        sessionStorage.removeItem('token');
                                        history.push({ pathname: '/login', state: history.location });
                                case 199:
                                case 404:
                                case 500:
                                        throw new Error(msg);
                        }
                })
                .catch(error => {
                        console.log(error.message);
                        return Promise.reject(error.message);
                })
};