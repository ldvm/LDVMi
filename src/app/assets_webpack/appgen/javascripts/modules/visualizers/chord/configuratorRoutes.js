import React from 'react'
import { Route } from 'react-router'
import validateVisualizer from '../utils/validateVisualizer'
import Configurator from './containers/Configurator'
import { name, path } from './definition'
import createConfiguratorRoutes from '../utils/createConfiguratorRoutes'

const createRoutes = dispatch => (
  <Route component={validateVisualizer(Configurator, path)} path={path} key={name} />
);

export default createConfiguratorRoutes({ name, path }, createRoutes);
