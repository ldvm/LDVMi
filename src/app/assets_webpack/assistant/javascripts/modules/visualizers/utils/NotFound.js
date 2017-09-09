import React from 'react'
import { Route } from 'react-router'
import Alert from '../../../components/Alert'
import BodyPadding from '../../../components/BodyPadding'

const NotFound = () => (
  <BodyPadding>
    <Alert danger>
      Configurator component for this visualizer was not found. Is the component correctly
      registered? Is the visualizer name property correctly configured?
    </Alert>
  </BodyPadding>
);

export default function createRoutes(dispatch) {
  return (
    <Route component={NotFound} path="*"/>
  );
}
