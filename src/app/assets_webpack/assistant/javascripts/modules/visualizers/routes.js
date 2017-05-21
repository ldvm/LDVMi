import React from 'react'
import { routeActions } from 'redux-simple-router'
import ConfiguratorsRouteFactory from './utils/ConfiguratorsRouteFactory'
import dataCubeRoutes from './datacube/configuratorRoutes'
import googleMapsRoutes from './googleMaps/configuratorRoutes'
import chordRoutes from './chord/configuratorRoutes'
import timelineInstantsRoutes from './timeline/components/instants/configuratorRoutes'
import timelineIntervalsRoutes from './timeline/components/intervals/configuratorRoutes'
import timelineThingsInstantsRoutes from './timeline/components/thingsInstants/configuratorRoutes'
import timelineThingsIntervalsRoutes from './timeline/components/thingsIntervals/configuratorRoutes'
import timelineThingsThingsInstantsRoutes from './timeline/components/thingsThingsInstants/configuratorRoutes'
import timelineThingsThingsIntervalsRoutes from './timeline/components/thingsThingsIntervals/configuratorRoutes'
import { Visualizer, VisualizerWithPipelines } from '../core/models'
import { applicationUrl } from '../app/configuratorRoutes'

const routeFactory = new ConfiguratorsRouteFactory();

// ***Here*** you register all visualizer configurator routes

routeFactory.register(dataCubeRoutes);
routeFactory.register(googleMapsRoutes);
routeFactory.register(chordRoutes);
routeFactory.register(timelineInstantsRoutes);
routeFactory.register(timelineIntervalsRoutes);
routeFactory.register(timelineThingsInstantsRoutes);
routeFactory.register(timelineThingsIntervalsRoutes);
routeFactory.register(timelineThingsThingsInstantsRoutes);
routeFactory.register(timelineThingsThingsIntervalsRoutes);

export default dispatch => routeFactory.createRoutes(dispatch);

// "Named" routes

export const getConfiguratorPath = visualizer => {
  if (!(visualizer instanceof Visualizer || visualizer instanceof VisualizerWithPipelines)) {
    throw new Error('This is not a valid Visualizer object!');
  }

  if (!visualizer.name) {
    console.warn(`Visualizer "${visualizer.title}" has an empty name! Please go to Dashboard an choose a name for this visualizer.`);
    return 'notFound';
  }

  return visualizer.name;
};

export const visualizerConfiguratorUrl = (appId, visualizer) =>
  applicationUrl(appId) + '/' + getConfiguratorPath(visualizer);

export const visualizerConfigurator = (appId, visualizer) =>
  routeActions.push(visualizerConfiguratorUrl(appId, visualizer));

export const getRegisteredPaths = ::routeFactory.getRegisteredPaths;
export const getRegisteredVisualizerNames = ::routeFactory.getRegisteredPaths; // just an alias
