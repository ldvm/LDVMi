import React from 'react'
import {Route, IndexRoute} from 'react-router'
import App from './containers/App'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import createAppRoutes from './modules/createApp/routes'
import manageAppRoutes from './modules/manageApp/routes'
import authRoutes from './modules/auth/routes'

export default function createRoutes(dispatch) {
  return (
    <Route component={App} path='/'>
      <IndexRoute component={Home} />
      {authRoutes(dispatch)}
      {createAppRoutes(dispatch)}
      {manageAppRoutes(dispatch)}
      <Route component={NotFound} path='*' />
    </Route>
  );
}