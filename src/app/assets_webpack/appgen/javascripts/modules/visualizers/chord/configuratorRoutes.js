import React from 'react'
import { Route } from 'react-router'
import validateVisualizer from '../utils/validateVisualizer'
import Configurator from './containers/Configurator'
import { name, path } from './definition'
import createConfiguratorRoutes from '../utils/createConfiguratorRoutes'
import { getGraph } from './ducks/graph'

const createRoutes = dispatch => (
  <Route component={validateVisualizer(Configurator, path)} path={path} key={name}
    onEnter={ next => dispatch(getGraph(next.params.id))} />
);

export default createConfiguratorRoutes({ name, path }, createRoutes);
