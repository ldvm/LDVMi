import React from 'react'
import { IndexRoute, Route } from 'react-router'
import ApplicationLoader from '../../../../app/pages/ApplicationLoader'
import NotFound from '../../../../platform/pages/NotFound'
import Places from '../../pages/Places'

export default function createRoutes(dispatch) {
  return (
    <Route component={ApplicationLoader} path='/'>
      <IndexRoute component={Places} configurable={false}/>
      <Route component={Places} configurable={false} path='embed'/>
      <Route component={NotFound} path='*'/>
    </Route>
  );
}
