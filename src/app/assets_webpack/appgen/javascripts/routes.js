import React from 'react'
import {Route, IndexRoute} from 'react-router'

import App from './containers/App'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'

const baseUrl = '/appgen'; // TODO: load from config

export default (
  <Route component={App} path={baseUrl}>
    <IndexRoute component={Home} />
    <Route component={SignUp} path="signup" />
    <Route component={SignIn} path="signin" />
    <Route component={NotFound} path="*"/>
  </Route>
);