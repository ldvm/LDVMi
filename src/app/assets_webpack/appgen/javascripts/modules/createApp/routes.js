import React from 'react'
import { Route, IndexRoute } from 'react-router'
import { getDataSources } from './ducks/dataSources'

import Nothing from '../../misc/components/Nothing'
import SelectSources from './pages/SelectSources'

export default function createRoutes(path, dispatch) {
  return (
    <Route component={Nothing} path={path}>
      <Route component={SelectSources} path='select-sources' onEnter={() => dispatch(getDataSources())} />
    </Route>
  );
}