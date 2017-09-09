import React from 'react'
import { Route } from 'react-router'
import Configurator from '../../pages/Configurator'
import { MODULE_PREFIX } from './prefix'

export default function createRoutes(dispatch) {
  return (
    <Route component={Configurator} path={MODULE_PREFIX}/>
  );
}
