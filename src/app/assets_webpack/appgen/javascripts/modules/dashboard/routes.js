import React from 'react'
import { Route, IndexRoute } from 'react-router'
import { routeActions } from 'redux-simple-router'
import { MODULE_PREFIX } from './prefix'
import Dashboard from './pages/Dashboard'
import Applications from './pages/Applications'
import DataSources from './pages/DataSources'
import Discoveries from './pages/Discoveries'
import Visualizers from './pages/Visualizers'


export default function createRoutes(dispatch) {
  return (
    <Route component={Dashboard} path={MODULE_PREFIX}>
      <Route component={DataSources} path="data-sources(/:page)" />
      <Route component={Discoveries} path="discoveries(/:page)" />
      <Route component={Visualizers} path="visualizers" />
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

export function dataSourcesUrl(page = null) {
  return dashboardUrl() + '/data-sources' + (page ? '/' + page : '');
}

export function dataSources(page = null) {
  return routeActions.push(dataSourcesUrl(page));
}

export function discoveriesUrl(page = null) {
  return dashboardUrl() + '/discoveries' + (page ? '/' + page : '');
}

export function discoveries(page = null) {
  return routeActions.push(discoveriesUrl(page));
}

export function visualizersUrl() {
  return dashboardUrl() + '/visualizers';
}

export function visualizers() {
  return routeActions.push(visualizersUrl());
}
