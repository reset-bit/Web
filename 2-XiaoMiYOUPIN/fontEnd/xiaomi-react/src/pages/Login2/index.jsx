import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import LoginPwd from './LoginPwd';
import LoginPhone from './LoginPhone';

class Login extends Component {
        render() {
                return (
                        <Switch>
                                <Route path='/login' exact><Redirect to='/login/pwd' /></Route>
                                <Route path='/login/pwd' component={LoginPwd} />
                                <Route path='/login/phone' component={LoginPhone}></Route>
                        </Switch>
                );
        }
}

export default Login;