import React from 'react'
import { Route, IndexRoute } from 'react-router'
import { routeActions } from 'redux-simple-router'

import Nothing from '../../misc/components/Nothing'
import Application from './pages/Application'
import { getApplication } from './ducks/application'

const MODULE_PATH = 'manage-app';

export default function createRoutes(dispatch) {
  return (
    <Route component={Application} path={MODULE_PATH + '/:id'} onEnter={next => {
      dispatch(getApplication(next.params.id));
    }}/>
  );
}

// "Named" routes

export function applicationUrl(id) {
  return '/manage-app/' + id;
}

export function application(id) {
  return routeActions.push(applicationUrl(id));
}
