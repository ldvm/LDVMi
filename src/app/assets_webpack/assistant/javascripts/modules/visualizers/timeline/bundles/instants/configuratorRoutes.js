import React from 'react'
import { Route } from 'react-router'
import { MODULE_PREFIX } from './prefix'
import Instants from '../../pages/Instants'

export default function createRoutes(dispatch) {
  return (
    <Route component={Instants} configurable={true} path={MODULE_PREFIX}/>
  );
}
