import React from 'react'
import { Route } from 'react-router'
import Alert from '../../../components/Alert'
import BodyPadding from '../../../components/BodyPadding'
import validateVisualizer from './validateVisualizer'
import createConfiguratorRoutes from './createConfiguratorRoutes'

const name = 'notFound';
const path = 'not-found';

const NotFound = () => (
  <BodyPadding>
    <Alert danger>Configurator component for this visualizer was not found</Alert>
  </BodyPadding>
);

const createRoutes = dispatch => (
  <Route component={validateVisualizer(NotFound, path)} path={path} key={path} />
);

export default createConfiguratorRoutes({ name, path }, createRoutes);
