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
      <Route component={DataSources} path="data-sources(/:page)" />
      <Route component={Discoveries} path="discoveries" />
      <Route component={Applications} path=":page" />
      <IndexRoute component={Applications} />
    </Route>
  );
}

// "Named" routes

export function dashboardUrl(page = null) {
  return '/' + MODULE_PREFIX + (page ? '/' + page : '');
}

export function dashboard() {
  return routeActions.push(dashboardUrl());
}

export function applicationsUrl(page = null) {
  return dashboardUrl(page);
}

export function applications(page = null) {
  return routeActions.push(applicationsUrl(page));
}

export function dataSourcesUrl() {
  return dashboardUrl() + '/data-sources';
}

export function discoveriesUrl() {
  return dashboardUrl() + '/discoveries';
}
