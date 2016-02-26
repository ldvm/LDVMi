import React from 'react'
import { Route, IndexRoute } from 'react-router'
import { getDataSources } from './ducks/dataSources'
import { getVisualizers } from './ducks/visualizers'

import Nothing from '../../misc/components/Nothing'
import SelectSources from './pages/SelectSources'
import Discovery from './pages/Discovery'

const MODULE_PATH = 'create-app';

export default function createRoutes(dispatch) {
  return (
    <Route component={Nothing} path={MODULE_PATH} onEnter={() => dispatch(getVisualizers())}>
      <Route component={SelectSources} path='select-sources' onEnter={() => dispatch(getDataSources())} />
      <Route component={Discovery} path="discovery/:userPipelineDiscoveryId" />
    </Route>
  );
}