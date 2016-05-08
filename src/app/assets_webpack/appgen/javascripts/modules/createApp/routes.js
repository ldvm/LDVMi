import React from 'react'
import { Route, IndexRoute } from 'react-router'
import { getVisualizers } from './../core/ducks/visualizers'

import CreateApp from './pages/CreateApp'
import SelectSources from './pages/SelectSources'
import Discovery from './pages/Discovery'

const MODULE_PATH = 'create-app';

export default function createRoutes(dispatch) {
  return (
    <Route component={CreateApp} path={MODULE_PATH} onEnter={() => dispatch(getVisualizers())}>
      <Route component={SelectSources} path='select-sources' />
      <Route component={Discovery} path="discovery/:userPipelineDiscoveryId" />
    </Route>
  );
}
