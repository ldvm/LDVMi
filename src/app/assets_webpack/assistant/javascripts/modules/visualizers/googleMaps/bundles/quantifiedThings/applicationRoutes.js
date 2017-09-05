import React from 'react'
import { IndexRoute, Route } from 'react-router'
import ApplicationLoader from '../../../../app/pages/ApplicationLoader'
import NotFound from '../../../../platform/pages/NotFound'
import QuantifiedThings from '../../pages/QuantifiedThings'

export default function createRoutes(dispatch) {
  return (
    <Route component={ApplicationLoader} path='/'>
      <IndexRoute component={QuantifiedThings} configurable={false}/>
      <Route component={QuantifiedThings} configurable={false} path='embed'/>
      <Route component={NotFound} path='*'/>
    </Route>
  );
}
