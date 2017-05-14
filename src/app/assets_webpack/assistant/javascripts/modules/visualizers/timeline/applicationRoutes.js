import React from 'react'
import { Route } from 'react-router'
import ApplicationLoader from '../../app/pages/ApplicationLoader'
import NotFound from '../../platform/pages/NotFound'
import Instants from "./pages/Instants"
import Intervals from "./pages/Intervals"
import InstantsToFirstLevel from "./pages/InstantsToFirstLevel"
import IntervalsToFirstLevel from "./pages/IntervalsToFirstLevel"
import InstantsToSecondLevel from "./pages/InstantsToSecondLevel"
import IntervalsToSecondLevel from "./pages/IntervalsToSecondLevel"

export default function createRoutes(dispatch) {
    return (
        <Route component={ApplicationLoader} path='/'>
            <Route component={Intervals} path='intervals'/>
            <Route component={Instants}  path='instants' />

            <Route component={IntervalsToFirstLevel} path='intervals-things'/>
            <Route component={InstantsToFirstLevel}  path='instants-things' />

            <Route component={IntervalsToSecondLevel} path='intervals-things-things'/>
            <Route component={InstantsToSecondLevel}  path='instants-things-things' />

            <Route component={NotFound}  path='*' />
        </Route>
    );
}