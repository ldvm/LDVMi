import React from 'react'
import { IndexRoute, Route } from 'react-router'
import ApplicationLoader from '../../../../app/pages/ApplicationLoader'
import NotFound from '../../../../platform/pages/NotFound'
import IntervalsToFirstLevel from '../../pages/IntervalsToFirstLevel'

export default function createRoutes(dispatch) {
  return (
    <Route component={ApplicationLoader} path='/'>
      <IndexRoute component={IntervalsToFirstLevel} configurable={false}/>
      <Route component={IntervalsToFirstLevel} configurable={false} path='embed'/>
      <Route component={NotFound} path='*'/>
    </Route>
  );
}