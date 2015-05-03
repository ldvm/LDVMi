import React from 'react'
import {Route, DefaultRoute, NotFoundRoute} from 'react-router'

import Application from './Application.jsx'
import Home from './pages/Home.jsx'
import NotFound from './pages/NotFound.jsx'
import SignUp from './pages/SignUp.jsx'

export default (
    <Route name="home" handler={Application} path="/appgen">
        <DefaultRoute handler={Home}/>
        <Route name="signup" handler={SignUp} />
        <NotFoundRoute handler={NotFound}/>
    </Route>
);