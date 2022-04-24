import axios from 'axios';

function http(userOptions) {
        let defaultOptions = { method: 'get' };
        let ajaxOptions = Object.assign({}, defaultOptions, userOptions);
        ajaxOptions.headers = Object.assign({ Authorization: sessionStorage.getItem('token') }, ajaxOptions.headers);
        return axios(ajaxOptions)
                .then(res => {
                        if(res.status === 200) {
                                switch(res.data.status) {
                                        case 200:
                                                return res.data.data;
                                                break;
                                        case 199:
                                        case 400:
                                        case 404:
                                        case 500:
                                                throw new Error(res.data.message);
                                }
                        } else {
                                throw new Error(res.statusText);
                        }
                })
                .catch(err => {
                        console.log(err.message);
                        return Promise.reject();
                });
}

export default http;