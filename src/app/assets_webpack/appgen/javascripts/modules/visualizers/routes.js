import React from 'react'
import { Route } from 'react-router'
import { routeActions } from 'redux-simple-router'
import { applicationUrl } from '../manageApp/routes'
import Alert from '../../components/Alert'
import validateVisualizer from './validateVisualizer'

import dataCubeRoutes from './datacube/routes'
import googleMapsRoutes from './googleMaps/configuratorRoutes'

// TODO: use the visualizers model?
const mappings = {
  'http://linked.opendata.cz/resource/ldvm/visualizer/data-cube/DataCubeVisualizerTemplate': dataCubeRoutes.path,
  'http://linked.opendata.cz/resource/ldvm/visualizer/gmaps/GoogleMapsVisualizerTemplate': googleMapsRoutes.path
};

const NotFound = validateVisualizer(() => <Alert danger>Configurator component for this visualizer was not found</Alert>, 'not-found');

export default function createRoutes(dispatch) {
  return [
    dataCubeRoutes(dispatch),
    googleMapsRoutes(dispatch),
    <Route component={NotFound} path="not-found" key="not-found" />
  ];
}

export function getVisualizerConfiguratorPath(uri) {
  return mappings[uri] || 'not-found';
}

export function visualizerConfiguratorUrl(appId, uri) {
  return applicationUrl(appId) + '/' + getVisualizerConfiguratorPath(uri);
}

export function visualizerConfigurator(appId, uri) {
  return routeActions.push(visualizerConfiguratorUrl(appId, uri));
}
