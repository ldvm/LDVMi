import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Application } from '../../app/models'
import { Visualizer } from '../../core/models'
import * as routes from '../../app/configuratorRoutes'
import { getVisualizerConfiguratorPath } from './../routes'

/**
 * High-order component verifying that the visualizer passed through props corresponds to the
 * selected visualizer configurator.
 * @param VisualizerConfiguratorComponent selected visualizer component that should be validated
 * @param path corresponding path to this configurator
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
      const { dispatch, application, visualizer}  = props;
      if (getVisualizerConfiguratorPath(visualizer) != path) {
        dispatch(routes.application(application.id));
      }
    }

    render() {
      const { visualizer} = this.props;
      if (getVisualizerConfiguratorPath(visualizer) != path) {
        return null;
      }

      return <VisualizerConfiguratorComponent {...this.props} />
    }
  }

  return connect()(VisualizerValidator);
}
