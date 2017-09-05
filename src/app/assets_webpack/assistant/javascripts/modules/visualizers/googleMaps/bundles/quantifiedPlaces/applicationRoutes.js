import React from 'react'
import { IndexRoute, Route } from 'react-router'
import ApplicationLoader from '../../../../app/pages/ApplicationLoader'
import NotFound from '../../../../platform/pages/NotFound'
import QuantifiedPlaces from '../../pages/QuantifiedPlaces'

export default function createRoutes(dispatch) {
  return (
    <Route component={ApplicationLoader} path='/'>
      <IndexRoute component={QuantifiedPlaces} configurable={false}/>
      <Route component={QuantifiedPlaces} configurable={false} path='embed'/>
      <Route component={NotFound} path='*'/>
    </Route>
  );
}
