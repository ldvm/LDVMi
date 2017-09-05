import React from 'react'
import { routeActions } from 'redux-simple-router'
import ConfiguratorsRouteFactory from './utils/ConfiguratorsRouteFactory'
import dataCubeRoutes from './datacube/configuratorRoutes'
import chordRoutes from './chord/configuratorRoutes'

import googleMapsV1Routes from './googleMaps/bundles/v1/configuratorRoutes'
import googleMapsCoordinatesRoutes from './googleMaps/bundles/coordinates/configuratorRoutes'
import googleMapsPlacesRoutes from './googleMaps/bundles/places/configuratorRoutes'
import googleMapsPlacesValuesRoutes from './googleMaps/bundles/quantifiedPlaces/configuratorRoutes'
import googleMapsThingsPlacesValuesRoutes from './googleMaps/bundles/quantifiedThings/configuratorRoutes'

import timelineInstantsRoutes from './timeline/bundles/instants/configuratorRoutes'
import timelineIntervalsRoutes from './timeline/bundles/intervals/configuratorRoutes'
import timelineThingsInstantsRoutes from './timeline/bundles/thingsInstants/configuratorRoutes'
import timelineThingsIntervalsRoutes from './timeline/bundles/thingsIntervals/configuratorRoutes'
import timelineThingsThingsInstantsRoutes from './timeline/bundles/thingsThingsInstants/configuratorRoutes'
import timelineThingsThingsIntervalsRoutes from './timeline/bundles/thingsThingsIntervals/configuratorRoutes'

import { Visualizer, VisualizerWithPipelines } from '../core/models'
import { applicationUrl } from '../app/configuratorRoutes'

const routeFactory = new ConfiguratorsRouteFactory();

// ***Here*** you register all visualizer configurator routes

routeFactory.register(dataCubeRoutes);
routeFactory.register(chordRoutes);

// Google Maps
routeFactory.register(googleMapsV1Routes);
routeFactory.register(googleMapsCoordinatesRoutes);
routeFactory.register(googleMapsPlacesRoutes);
routeFactory.register(googleMapsPlacesValuesRoutes);
routeFactory.register(googleMapsThingsPlacesValuesRoutes);

// Timeline
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
