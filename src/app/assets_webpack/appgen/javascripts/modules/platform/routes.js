import React from 'react'
import { Route, IndexRoute } from 'react-router'
import { routeActions } from 'redux-simple-router'
import createAppRoutes from './../createApp/routes'
import manageAppRoutes from './../manageApp/routes'
import authRoutes from './../auth/routes'
import Platform from './containers/Platform'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Profile from './pages/Profile'
import { getUser } from '../auth/ducks/user'

export default function createRoutes(dispatch) {
  return (
    <Route component={Platform} path="/" onEnter={() => dispatch(getUser())}>
      <IndexRoute component={Home} />
      <Route component={Profile} path="profile" />
      {authRoutes(dispatch)}
      {createAppRoutes(dispatch)}
      {manageAppRoutes(dispatch)}
      <Route component={NotFound} path="*" />
    </Route>
  );
}

// "Named" routes

export function profileUrl() {
  return '/profile';
}

export function profile() {
  return routeActions.push(profileUrl());
}
