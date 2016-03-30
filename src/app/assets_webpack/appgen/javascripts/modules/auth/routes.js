import React from 'react'
import { Route, IndexRoute } from 'react-router'
import { routeActions } from 'redux-simple-router'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Nothing from '../../components/Nothing'

const MODULE_PATH = 'auth';

export default function createRoutes(dispatch) {
  return (
    <Route component={Nothing} path={MODULE_PATH}>
      <Route component={SignUp} path='signup' />
      <Route component={SignIn} path='signin' />
    </Route>
  );
}

// "Named" routes

export function signInUrl() {
  return '/' + MODULE_PATH + '/signin';
}

export function signUpUrl() {
  return '/' + MODULE_PATH + '/signup';
}

export function signIn() {
  return routeActions.push(signInUrl());
}

export function signUp() {
  return routeActions.push(signUpUrl());
}
