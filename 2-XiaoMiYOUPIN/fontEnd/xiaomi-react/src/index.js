// 打包js入口文件
import React from 'react';
import reactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { Provider } from 'react-redux';
import store from './store';
// import history from './router';
import './assets/reset.css';

// 将app根组件渲染到挂载点中
reactDOM.render(
        <Provider store={store}>
                {/* Router降级，以便在其他地方使用history */}
                {/*<Router history={history}><App /></Router>*/}
                <BrowserRouter><App /></BrowserRouter>
        </Provider>,
        document.getElementById('root')// public/index.html中规定root
);