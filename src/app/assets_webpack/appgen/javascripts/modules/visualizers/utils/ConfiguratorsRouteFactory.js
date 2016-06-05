import React from 'react'
import { Route } from 'react-router'
import createNotFoundRoutes from './NotFound'
import validateVisualizer from './validateVisualizer'

class ConfiguratorsRouteFactory {
  constructor() {
    this.routeFactories = [];
  }

  register(createRoutes) {
    this.routeFactories.push(createRoutes);
  }
  
  createRoutes(dispatch) {
    this.routeFactories.push(createNotFoundRoutes);

    return this.routeFactories.map(createRoutes => {
      const routes = createRoutes(dispatch);
      const path = routes.props.path;

      // Wrap the route with a validation component that makes sure that the loaded visualizer
      // configurator matches the visualizer required by the application.
      return (
        <Route
          {...routes.props}
          component={validateVisualizer(routes.props.component, path)}
          key={path}
        />
      )
    });
  }
}

export default ConfiguratorsRouteFactory;
