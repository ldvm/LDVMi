import React from 'react'
import { Route } from 'react-router'
import Alert from '../../../components/Alert'
import BodyPadding from '../../../components/BodyPadding'

const name = 'notFound';
const path = 'not-found';

const NotFound = () => (
  <BodyPadding>
    <Alert danger>Configurator component for this visualizer was not found</Alert>
  </BodyPadding>
);

export default function createRoutes(dispatch) {
  return (
    <Route component={NotFound} path="*" />
  );
}
