import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import LoginPwd from './Pwd/LoginPwd.jsx';
import LoginPhone from './Phone/LoginPhone.jsx';

export default props => (
        <Switch>
                <Route path='/login' exact>
                        <Redirect to={{pathname: '/login/pwd', state: props.location.state}} />
                </Route>
                <Route path='/login/pwd' component={LoginPwd} />
                <Route path='/login/phone' component={LoginPhone} />
        </Switch>
);