import React from 'react'
import { Route, IndexRoute } from 'react-router'
import createAppRoutes from './modules/createApp/routes'
import manageAppRoutes from './modules/manageApp/routes'
import authRoutes from './modules/auth/routes'
import Platform from './modules/platform/containers/Platform'
import Home from './modules/platform/pages/Home'
import NotFound from './modules/platform/pages/NotFound'

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