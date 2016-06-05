import React from 'react'
import { Route } from 'react-router'
import Configurator from './containers/Configurator'
import { name, path } from './definition'
import createConfiguratorRoutes from '../utils/createConfiguratorRoutes'

const createRoutes = dispatch => (
  <Route component={Configurator} path={path}  />
);

export default createConfiguratorRoutes({ name, path }, createRoutes);
