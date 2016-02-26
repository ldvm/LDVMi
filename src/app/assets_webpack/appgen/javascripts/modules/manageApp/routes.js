import React from 'react'
import { Route, IndexRoute } from 'react-router'
import { routeActions } from 'redux-simple-router'
import { getVisualizers } from './../common/ducks/visualizers'
import { getApplication } from './ducks/application'
import Application from './pages/Application'

const MODULE_PATH = 'manage-app';

export default function createRoutes(dispatch) {
  return (
    <Route component={Application} path={MODULE_PATH + '/:id'} onEnter={next => {
      dispatch(getVisualizers());
      dispatch(getApplication(next.params.id));
    }}/>
  );
}

// "Named" routes

export function applicationUrl(id) {
  return '/' + MODULE_PATH + '/' + id;
}

export function application(id) {
  return routeActions.push(applicationUrl(id));
}
