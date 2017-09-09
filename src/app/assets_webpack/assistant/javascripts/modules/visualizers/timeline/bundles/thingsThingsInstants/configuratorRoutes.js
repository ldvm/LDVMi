import React from 'react'
import { Route } from 'react-router'
import { MODULE_PREFIX } from './prefix'
import InstantsToSecondLevel from '../../pages/InstantsToSecondLevel'

export default function createRoutes(dispatch) {
  return (
    <Route component={InstantsToSecondLevel} configurable={true} path={MODULE_PREFIX}/>
  );
}
