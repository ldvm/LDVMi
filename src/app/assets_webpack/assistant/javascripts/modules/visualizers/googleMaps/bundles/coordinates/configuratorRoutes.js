import React from 'react'
import { Route } from 'react-router'
import { MODULE_PREFIX } from './prefix'
import Coordinates from '../../pages/Coordinates'

export default function createRoutes(dispatch) {
  return (
    <Route component={Coordinates} path={MODULE_PREFIX} configurable={true}/>
  );
}
