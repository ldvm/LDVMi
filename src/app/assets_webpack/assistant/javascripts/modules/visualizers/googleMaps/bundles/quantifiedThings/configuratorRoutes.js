import React from 'react'
import { Route } from 'react-router'
import { MODULE_PREFIX } from './prefix'
import QuantifiedThings from '../../pages/QuantifiedThings'

export default function createRoutes(dispatch) {
  return (
    <Route component={QuantifiedThings} path={MODULE_PREFIX} configurable={true}/>
  );
}
