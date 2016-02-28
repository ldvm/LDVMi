import React from 'react'
import { Route } from 'react-router'
import validateVisualizer from '../validateVisualizer'
import CenteredMessage from '../../../misc/components/CenteredMessage'

export const MODULE_PATH = 'google-maps';

const Page = validateVisualizer(() => <CenteredMessage>Google Maps</CenteredMessage>, MODULE_PATH);

export default function createRoutes(dispatch) {
  return (
    <Route component={Page} path={MODULE_PATH} key={MODULE_PATH}  />
  );
}

createRoutes.path = MODULE_PATH;
