import axios from 'axios';

function http(userOptions) {
        var defaultOptions = { method: 'get' };// 默认配置
        var ajaxOption = Object.assign({}, defaultOptions, userOptions);// 伪深拷贝合并
        ajaxOption.headers = Object.assign({}, { Authorization: sessionStorage.getItem('token') }, userOptions.headers);
        return axios(ajaxOption)
                .then(res => {
                        if(res.status === 200) {
                                switch(res.data.code) {
                                        case 200:
                                                return res.data.data;
                                                break;
                                        case 199:
                                        case 401:
                                        case 404:
                                        case 500:
                                                throw new Error(res.data.msg);
                                }
                        } else {
                                throw new Error(res.statusText);
                        }
                })
                .catch(err => {
                        console.log(err.message);
                        return Promise.reject();// 总是返回一个失败的promise对象
                });
};

export default http;