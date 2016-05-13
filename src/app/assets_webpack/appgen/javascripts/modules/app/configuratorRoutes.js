import React from 'react'
import { Route } from 'react-router'
import { routeActions } from 'redux-simple-router'
import Configurator from './pages/Configurator'
import visualizerConfiguratorsRoutes from '../visualizers/routes'
import { path } from './definition'

export default function createRoutes(dispatch) {
  return (
    <Route component={Configurator} path={path + '/:id'}>
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
