import React from 'react'
import { IndexRoute, Route } from 'react-router'
import ApplicationLoader from '../../../../app/pages/ApplicationLoader'
import NotFound from '../../../../platform/pages/NotFound'
import IntervalsToSecondLevel from '../../pages/IntervalsToSecondLevel'

export default function createRoutes(dispatch) {
  return (
    <Route component={ApplicationLoader} path='/'>
      <IndexRoute component={IntervalsToSecondLevel} configurable={false}/>
      <Route component={IntervalsToSecondLevel} configurable={false} path='embed'/>
      <Route component={NotFound} path='*'/>
    </Route>
  );
}