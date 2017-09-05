import React from 'react'
import { Route } from 'react-router'
import { MODULE_PREFIX } from './prefix'
import IntervalsToSecondLevel from '../../pages/IntervalsToSecondLevel'

export default function createRoutes(dispatch) {
  return (
    <Route component={IntervalsToSecondLevel} configurable={true} path={MODULE_PREFIX}/>
  );
}
