import React from 'react'
import { routeActions } from 'redux-simple-router'
import ConfiguratorsRouteFactory from './utils/ConfiguratorsRouteFactory'
import dataCubeRoutes from './datacube/configuratorRoutes'
import googleMapsRoutes from './googleMaps/configuratorRoutes'
import chordRoutes from './chord/configuratorRoutes'
import { Visualizer, VisualizerWithPipelines } from '../core/models'
import { applicationUrl } from '../app/configuratorRoutes'

const routeFactory = new ConfiguratorsRouteFactory();

// Register all visualizer configurator routes
routeFactory.register(dataCubeRoutes);
routeFactory.register(googleMapsRoutes);
routeFactory.register(chordRoutes);

export default dispatch => routeFactory.createRoutes(dispatch);

export const getConfiguratorPath = visualizer => {
  if (!(visualizer instanceof Visualizer || visualizer instanceof VisualizerWithPipelines)) {
    throw new Error('This is not a valid Visualizer object!');
  }
  return visualizer.name;
};

export const visualizerConfiguratorUrl = (appId, visualizer) =>
  applicationUrl(appId) + '/' + getConfiguratorPath(visualizer);

export const visualizerConfigurator = (appId, visualizer) =>
  routeActions.push(visualizerConfiguratorUrl(appId, visualizer));
