import React from 'react'
import { Route } from 'react-router'
import { MODULE_PREFIX } from './prefix'
import QuantifiedPlaces from '../../pages/QuantifiedPlaces'

export default function createRoutes(dispatch) {
  return (
    <Route component={QuantifiedPlaces} path={MODULE_PREFIX} configurable={true}/>
  );
}
