// App组件
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Pages from './pages';
import './App.css';

class App extends React.Component {
        render() {
                return (
                        <Switch>
                                {/* 模糊匹配，使用exact打开精确匹配。始终匹配先匹配到的 */}
                                <Route path='/' exact><Redirect to='/home' /></Route>
                                <Route path='/home' component={ Pages.Home } />
                                <Route path='/category' component={ Pages.Category } />
                                <Route path='/list/:cid' component={Pages.List}/>
                                <Route path='/profile' component={Pages.Profile} />
                                <Route path='/login' component={Pages.Login}></Route>
                                <Route render={({ location }) => {// 原本参数为props，解构history location match
                                        // 没登录访问不存在页面将跳转login，登录后访问不存在页面将跳转404
                                        return sessionStorage.getItem('token') ? (
                                                <Switch>
                                                        <Route path='/cart' component={Pages.Cart}></Route>
                                                        <Route path='/address' component={Pages.Address}></Route>
                                                        <Route path='*' component={Pages.NotFound} />
                                                </Switch>
                                        ) : (
                                                <Redirect to={{ pathname: '/login', state: { from: location } }}></Redirect>
                                        );
                                }} />
                        </Switch>
                );
        }
}

export default App;