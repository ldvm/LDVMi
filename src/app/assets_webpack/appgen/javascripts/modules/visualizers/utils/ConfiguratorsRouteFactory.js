import React from 'react'
import { Route } from 'react-router'
import createNotFoundRoutes from './NotFound'
import { Visualizer, VisualizerWithPipelines } from '../../core/models'
import { applicationUrl } from '../../app/configuratorRoutes'
import validateVisualizer from './validateVisualizer'

class ConfiguratorsRouteFactory {
  constructor() {
    this.routeFactories = [];
    this.mapping = {};
  }

  register(createRoutes) {
    const visualizer = createRoutes.visualizer;
    if (!visualizer) {
      throw new Error('Cannot register routes. The property visualizer is empty')
    }
    if (!visualizer.name) {
      throw new Error('Cannot register routes. The property visualizer.name is empty.');
    }
    if (!visualizer.path) {
      throw new Error('Cannot register routes. The property visualizer.path is empty.');
    }

    this.routeFactories.push(createRoutes);
    this.mapping[visualizer.name] = visualizer.path;
  }
  
  createRoutes(dispatch) {
    this.routeFactories.push(createNotFoundRoutes);
    return this.routeFactories.map(createRoutes => {
      const routes = createRoutes(dispatch);
      const path = routes.props.path;

      return (
        <Route
          {...routes.props}
          component={validateVisualizer(routes.props.component, path)}
          key={path}
        />
      )
    });
  }

  getConfiguratorPath(visualizer) {
    if (!(visualizer instanceof Visualizer || visualizer instanceof VisualizerWithPipelines)) {
      throw new Error('This is not a valid Visualizer object!');
    }

    return this.mapping[visualizer.name] || createNotFoundRoutes.visualizer.path;
  }

  getConfiguratorUrl(appId, visualizer) {
    return applicationUrl(appId) + '/' + this.getConfiguratorPath(visualizer);
  }
}

export default ConfiguratorsRouteFactory;
