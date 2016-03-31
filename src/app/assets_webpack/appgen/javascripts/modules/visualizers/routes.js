import React from 'react'
import { routeActions } from 'redux-simple-router'
import ConfiguratorsRouteFactory from './utils/ConfiguratorsRouteFactory'
import dataCubeRoutes from './datacube/configuratorRoutes'
import googleMapsRoutes from './googleMaps/configuratorRoutes'
import chordRoutes from './chord/configuratorRoutes'

const routeFactory = new ConfiguratorsRouteFactory();

// Register all visualizer configurator routes
routeFactory.register(dataCubeRoutes);
routeFactory.register(googleMapsRoutes);
routeFactory.register(chordRoutes);

export const createRoutes = dispatch => routeFactory.createRoutes(dispatch);
export const getVisualizerConfiguratorPath = visualizer => routeFactory.getConfiguratorPath(visualizer);
export const getVisualizerConfiguratorUrl = (appId, visualizer) => routeFactory.getConfiguratorUrl(appId, visualizer);
export const visualizerConfigurator = (appId, visualizer) => {
  return routeActions.push(getVisualizerConfiguratorUrl(appId, visualizer));
};
export default createRoutes;
