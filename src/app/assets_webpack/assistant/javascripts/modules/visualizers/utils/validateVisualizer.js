import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Application } from '../../app/models'
import { Visualizer } from '../../core/models'
import * as routes from '../../app/configuratorRoutes'
import { getConfiguratorPath } from './../routes'

/**
 * High-order component verifying that the visualizer passed through props corresponds to the
 * selected visualizer configurator. This component is automatically wrapped around all registered
 * Configurators by the ConfiguratorsRouteFactory.
 *
 * Sample scenario: the user manually enters the URL /assistant/app/1/googleMaps to configure the
 * application with id = 1. Google Maps visualizer is loaded based on the URL. Nevertheless,
 * this application is actually a D3.js Chord application. It requires a different visualizer.
 * The incorrect visualizer object is injected through props into the Google Maps configurator. This
 * component intercepts that, detects the problem and performs necessary redirection.
 *
 * @param VisualizerConfiguratorComponent selected visualizer component that should be validated
 * @param path - the path of currently rendered visualizer. It has to match the visualizer
 *  passed through props.
 * @returns {*}
 */
export default function validateVisualizer(VisualizerConfiguratorComponent, path) {
  class VisualizerValidator extends Component {

    static propTypes = {
      application: PropTypes.instanceOf(Application).isRequired,
      visualizer: PropTypes.instanceOf(Visualizer).isRequired,
      dispatch: PropTypes.func.isRequired
    };

    componentWillMount() {
      this.validate(this.props);
    }

    componentWillReceiveProps(props) {
      this.validate(props);
    }

    validate(props) {
      // If the selected application visualizer path doesn't match current path, then redirect
      // back to the main application component which should make the right decision now.
      // (In case of path == "*", which is the fallback <NotFound /> component, we don't redirect
      // anywhere, there is no point)
      const { dispatch, application, visualizer } = props;
      if (getConfiguratorPath(visualizer) != path && path != '*') {
        dispatch(routes.application(application.id));
      }
    }

    render() {
      const { visualizer } = this.props;
      if (getConfiguratorPath(visualizer) != path && path != '*') {
        return null;
      }

      return <VisualizerConfiguratorComponent {...this.props} />
    }
  }

  return connect()(VisualizerValidator);
}
