import React from 'react'
import { IndexRoute, Route } from 'react-router'
import ApplicationLoader from '../../../../app/pages/ApplicationLoader'
import Instants from '../../pages/Instants'
import NotFound from '../../../../platform/pages/NotFound'

export default function createRoutes(dispatch) {
  return (
    <Route component={ApplicationLoader} path='/'>
      <IndexRoute component={Instants} configurable={false}/>
      <Route component={Instants} configurable={false} path='embed'/>
      <Route component={NotFound} path='*'/>
    </Route>
  );
}