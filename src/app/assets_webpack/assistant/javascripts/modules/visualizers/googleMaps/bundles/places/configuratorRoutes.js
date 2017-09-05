import React from 'react'
import { Route } from 'react-router'
import { MODULE_PREFIX } from './prefix'
import Places from '../../pages/Places'

export default function createRoutes(dispatch) {
  return (
    <Route component={Places} path={MODULE_PREFIX} configurable={true}/>
  );
}
