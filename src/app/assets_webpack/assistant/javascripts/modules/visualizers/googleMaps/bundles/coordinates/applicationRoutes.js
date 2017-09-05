import React from 'react'
import { IndexRoute, Route } from 'react-router'
import ApplicationLoader from '../../../../app/pages/ApplicationLoader'
import NotFound from '../../../../platform/pages/NotFound'
import Coordinates from '../../pages/Coordinates'

export default function createRoutes(dispatch) {
  return (
    <Route component={ApplicationLoader} path='/'>
      <IndexRoute component={Coordinates} configurable={false}/>
      <Route component={Coordinates} configurable={false} path='embed'/>
      <Route component={NotFound} path='*'/>
    </Route>
  );
}
