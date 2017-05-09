import React from 'react'
import { Route } from 'react-router'
import ThingsWithThingsWithIntervals from './pages/ThingsWithThingsWithIntervals'
import { MODULE_PREFIX } from './prefix'

export default function createRoutes(dispatch) {
    return (
        <Route component={ThingsWithThingsWithIntervals} path={MODULE_PREFIX} />
    );
}
