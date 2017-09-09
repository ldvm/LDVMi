import React from 'react'
import { Route } from 'react-router'
import { MODULE_PREFIX } from './prefix'
import InstantsToFirstLevel from '../../pages/InstantsToFirstLevel'

export default function createRoutes(dispatch) {
  return (
    <Route component={InstantsToFirstLevel} configurable={true} path={MODULE_PREFIX}/>
  );
}
