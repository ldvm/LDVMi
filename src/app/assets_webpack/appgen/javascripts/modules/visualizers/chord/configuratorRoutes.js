import React from 'react'
import { Route } from 'react-router'
import validateVisualizer from '../utils/validateVisualizer'
import Configurator from './containers/Configurator'
import { name, path } from './definition'
import createConfiguratorRoutes from '../utils/createConfiguratorRoutes'
import { getGraph } from './ducks/graph'
import { getSearchableLens } from './ducks/searchableLens'
import { getConfiguration } from './ducks/configuration'

const createRoutes = dispatch => (
  <Route component={validateVisualizer(Configurator, path)} path={path} key={name}
    onEnter={ next => {
      const id = next.params.id;
      dispatch(getGraph(id));
      dispatch(getSearchableLens(id));
      dispatch(getConfiguration(id));
    }} />
);

export default createConfiguratorRoutes({ name, path }, createRoutes);
