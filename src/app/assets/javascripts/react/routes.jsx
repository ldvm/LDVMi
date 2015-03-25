import React from 'react'
import Router from 'react-router'

import Application from './Application.jsx'
import Home from './pages/Home.jsx'
import Visualization from './pages/Visualization.jsx'
import Visualizations from './pages/Visualizations.jsx'
import Visualizers from './pages/Visualizers.jsx'
import Visualize from './pages/Visualize.jsx'
import NotFound from './pages/NotFound.jsx'

var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;

export default (
    <Route name="home" handler={Application} path="/react">
        <DefaultRoute handler={Home}/>
        <Route name="visualizations" handler={Visualizations}/>
        <Route name="visualisation" path="visualisation/:id" handler={Visualization}/>
        <Route name="visualizers" handler={Visualizers}/>
        <NotFoundRoute handler={NotFound}/>
    </Route>
);