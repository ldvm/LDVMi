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
    // Make a copy & add not found fallback route.
    const routeFactories = this.routeFactories.slice();
    routeFactories.push(createNotFoundRoutes);

    return routeFactories.map(createRoutes => {
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

  /**
   * Return paths of the registered configurators. As the path is also the name of a visualizer
   * plugin, this essentially returns all registered visualizer plugins.
   * @returns {Array|*}
   */
  getRegisteredPaths() {
    return this.routeFactories.map(createRoutes =>
      createRoutes(() => {
      }).props.path);
  }
}

export default ConfiguratorsRouteFactory;
