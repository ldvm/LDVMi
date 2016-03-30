import React from 'react'
import { Route, IndexRoute } from 'react-router'
import createAppRoutes from './../createApp/routes'
import manageAppRoutes from './../manageApp/routes'
import authRoutes from './../auth/routes'
import Platform from './containers/Platform'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

export default function createRoutes(dispatch) {
  return (
    <Route component={Platform} path='/'>
      <IndexRoute component={Home} />
      {authRoutes(dispatch)}
      {createAppRoutes(dispatch)}
      {manageAppRoutes(dispatch)}
      <Route component={NotFound} path='*' />
    </Route>
  );
}