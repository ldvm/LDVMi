import React from 'react'
import { IndexRoute, Route } from 'react-router'
import ApplicationLoader from '../../../../app/pages/ApplicationLoader'
import NotFound from '../../../../platform/pages/NotFound'
import InstantsToFirstLevel from '../../pages/InstantsToFirstLevel'

export default function createRoutes(dispatch) {
  return (
    <Route component={ApplicationLoader} path='/'>
      <IndexRoute component={InstantsToFirstLevel} configurable={false}/>
      <Route component={InstantsToFirstLevel} configurable={false} path='embed'/>
      <Route component={NotFound} path='*'/>
    </Route>
  );
}