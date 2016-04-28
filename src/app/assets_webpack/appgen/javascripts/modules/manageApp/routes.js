import React from 'react'
import { Route } from 'react-router'
import { routeActions } from 'redux-simple-router'
import Application from './pages/Application'
import visualizerConfiguratorsRoutes from '../visualizers/routes'

const MODULE_PATH = 'manage-app';

export default function createRoutes(dispatch) {
  return (
    <Route component={Application} path={MODULE_PATH + '/:id'}>
      {visualizerConfiguratorsRoutes(dispatch)}
    </Route>
  );
}

// "Named" routes

export function applicationUrl(id) {
  return '/' + MODULE_PATH + '/' + id;
}

export function application(id) {
  return routeActions.push(applicationUrl(id));
}
