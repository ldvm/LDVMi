import React from 'react'
import { Route, IndexRoute } from 'react-router'
import { routeActions } from 'redux-simple-router'
import { MODULE_PREFIX } from './prefix'
import Dashboard from './pages/Dashboard'


export default function createRoutes(dispatch) {
  return (
    <Route component={Dashboard} path={MODULE_PREFIX}>
    </Route>
  );
}

// "Named" routes

export function dashboardUrl() {
  return '/' + MODULE_PREFIX;
}

export function dashboard() {
  return routeActions.push(dashboardUrl());
}
