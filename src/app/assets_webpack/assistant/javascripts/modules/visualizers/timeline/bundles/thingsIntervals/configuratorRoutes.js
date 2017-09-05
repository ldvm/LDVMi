import React from 'react'
import { Route } from 'react-router'
import { MODULE_PREFIX } from './prefix'
import IntervalsToFirstLevel from '../../pages/IntervalsToFirstLevel'

export default function createRoutes(dispatch) {
  return (
    <Route component={IntervalsToFirstLevel} configurable={true} path={MODULE_PREFIX}/>
  );
}
