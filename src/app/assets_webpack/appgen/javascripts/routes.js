import React from 'react'
import {Route, IndexRoute} from 'react-router'

import App from './containers/App'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import SignUp from './pages/SignUp'

export default (
  <Route name="home" component={App} path="/appgen">
    <IndexRoute component={Home} />
    <Route name="signup" component={SignUp} path="signup" />
    <Route component={NotFound} path="*"/>
  </Route>
);