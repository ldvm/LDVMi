import React from 'react'
import { Route, IndexRoute } from 'react-router'
import { routeActions } from 'redux-simple-router'
import createAppRoutes from '../createApp/routes'
import manageAppRoutes from '../app/configuratorRoutes'
import authRoutes from '../auth/routes'
import dashboardRoutes from '../dashboard/routes'
import Platform from './containers/Platform'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Catalog from './pages/Catalog'
import { getUser } from '../auth/ducks/user'
import { getVisualizers } from '../core/ducks/visualizers'

export default function createRoutes(dispatch) {
  return (
    <Route component={Platform} path="/" onEnter={() => {
      dispatch(getUser());
      dispatch(getVisualizers());
    }}>
      <IndexRoute component={Home} />
      <Route component={Catalog} path="catalog(/:page)" />
      {authRoutes(dispatch)}
      {createAppRoutes(dispatch)}
      {manageAppRoutes(dispatch)}
      {dashboardRoutes(dispatch)}
      <Route component={NotFound} path="*" />
    </Route>
  );
}

// "Named" routes

export function catalogUrl(page = null) {
  return '/catalog' + (page ? '/' + page : '');
}

export function catalog(page = null) {
  return routeActions.push(catalogUrl(page));
}
