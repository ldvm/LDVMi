import React from 'react'
import {Route, IndexRoute} from 'react-router'

import Index from './pages/Index'
import SelectSources from './pages/SelectSources'
import Discovery from './pages/Discovery'
import Pipelines from './pages/Pipelines'
import Pipeline from './pages/Pipeline'
import Evaluation from './pages/Evaluation'

import { getPipelineEvaluations } from './ducks/evaluations'
import { getPipeline } from './ducks/pipeline'
import { getPipelines } from './ducks/pipelines'

export default function createRoutes(path, dispatch) {
  return (
    <Route component={Index} path={path}>
      <Route component={SelectSources} path='select-sources' />
      <Route component={Discovery} path='discovery' />
      <Route component={Pipelines} path="pipelines/:discoveryId" onEnter={(next) => {
        dispatch(getPipelines(next.params.discoveryId));
      }} />
      <Route component={Pipeline} path="pipeline/:pipelineId" onEnter={(next) => {
        dispatch(getPipeline(next.params.pipelineId));
        dispatch(getPipelineEvaluations(next.params.pipelineId));
      }} />
      <Route component={Evaluation} path='evaluation/:pipelineId' />
    </Route>
  );
}