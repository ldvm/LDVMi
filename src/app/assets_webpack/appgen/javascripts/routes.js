import React from 'react'
import {Route, IndexRoute} from 'react-router'
import { baseUrl } from './config'
import App from './containers/App'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import SelectSources from './pages/SelectSources'
import Discovery from './pages/Discovery'

export default (
  <Route component={App} path='/'>
    <IndexRoute component={Home} />
    <Route component={SignUp} path='signup' />
    <Route component={SignIn} path='signin' />
    <Route component={SelectSources} path='select-sources' />
    <Route component={Discovery} path='discovery' />
    <Route component={NotFound} path='*' />
  </Route>
);