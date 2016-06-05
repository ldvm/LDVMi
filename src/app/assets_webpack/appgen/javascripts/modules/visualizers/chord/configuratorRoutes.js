import React from 'react'
import { Route } from 'react-router'
import Configurator from './containers/Configurator'
import { name, path } from './definition'

export default function createRoutes(dispatch) {
  return (
    <Route component={Configurator} path={path} />
  );
}
