import React from 'react'
import { IndexRoute, Route } from 'react-router'
import ApplicationLoader from '../../../../app/pages/ApplicationLoader'
import NotFound from '../../../../platform/pages/NotFound'
import InstantsToSecondLevel from '../../pages/InstantsToSecondLevel'

export default function createRoutes(dispatch) {
  return (
    <Route component={ApplicationLoader} path='/'>
      <IndexRoute component={InstantsToSecondLevel} configurable={false}/>
      <Route component={InstantsToSecondLevel} configurable={false} path='embed'/>
      <Route component={NotFound} path='*'/>
    </Route>
  );
}