import React from 'react'
import { Route, IndexRoute } from 'react-router'

import Nothing from '../../misc/components/Nothing'
import Application from './pages/Application'
import { getApplication } from './ducks/application'

export default function createRoutes(path, dispatch) {
  return (
    <Route component={Application} path={path + '/:id'} onEnter={next => {
      dispatch(getApplication(next.params.id));
    }}/>
  );
}
