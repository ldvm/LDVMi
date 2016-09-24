import React from 'react'
import { Route } from 'react-router'
import { routeActions } from 'redux-simple-router'
import ConfiguratorLoader from './pages/ConfiguratorLoader'
import visualizerConfiguratorsRoutes from '../visualizers/routes'
import { path } from './definition'

export default function createRoutes(dispatch) {
  return (
    <Route component={ConfiguratorLoader} path={path + '/:id'}>
      {visualizerConfiguratorsRoutes(dispatch)}
    </Route>
  );
}

// "Named" routes

export function applicationUrl(id) {
  return '/' + path + '/' + id;
}

export function application(id) {
  return routeActions.push(applicationUrl(id));
}
