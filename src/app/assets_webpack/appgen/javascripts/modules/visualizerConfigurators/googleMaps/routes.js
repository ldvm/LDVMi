import React from 'react'
import { Route } from 'react-router'
import validateVisualizer from '../validateVisualizer'
import Configurator from './containers/Configurator'

export const MODULE_PATH = 'google-maps';

export default function createRoutes(dispatch) {
  return (
    <Route component={validateVisualizer(Configurator, MODULE_PATH)} path={MODULE_PATH} key={MODULE_PATH} />
  );
}

createRoutes.path = MODULE_PATH;
