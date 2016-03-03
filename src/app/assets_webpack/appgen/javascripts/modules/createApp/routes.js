import React from 'react'
import { Route, IndexRoute } from 'react-router'
import { getDataSources } from './ducks/dataSources'
import { getVisualizers } from './../common/ducks/visualizers'

import NarrowedLayout from '../../misc/components/NarrowedLayout'
import SelectSources from './pages/SelectSources'
import Discovery from './pages/Discovery'

const MODULE_PATH = 'create-app';

export default function createRoutes(dispatch) {
  return (
    <Route component={NarrowedLayout} path={MODULE_PATH} onEnter={() => dispatch(getVisualizers())}>
      <Route component={SelectSources} path='select-sources' onEnter={() => dispatch(getDataSources())} />
      <Route component={Discovery} path="discovery/:userPipelineDiscoveryId" />
    </Route>
  );
}