import React from 'react'
import { Route, IndexRoute } from 'react-router'
import { routeActions } from 'redux-simple-router'
import { MODULE_PREFIX } from './prefix'
import Dashboard from './pages/Dashboard'
import Applications from './pages/Applications'
import DataSources from './pages/DataSources'
import Discoveries from './pages/Discoveries'


export default function createRoutes(dispatch) {
  return (
    <Route component={Dashboard} path={MODULE_PREFIX}>
      <IndexRoute component={Applications} />
      <Route component={DataSources} path="data-sources" />
      <Route component={Discoveries} path="discoveries" />
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

export function applicationsUrl() {
  return dashboardUrl();
}

export function dataSourcesUrl() {
  return dashboardUrl() + '/data-sources';
}

export function discoveriesUrl() {
  return dashboardUrl() + '/discoveries';
}
