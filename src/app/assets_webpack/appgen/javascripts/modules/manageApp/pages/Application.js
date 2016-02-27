import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import Helmet from 'react-helmet'
import { Link } from 'react-router'
import { applicationSelector, applicationStatusSelector, applicationVisualizerSelector } from '../ducks/application'
import { Application as ApplicationModel } from '../models'
import { Visualizer } from '../../common/models'
import { PromiseStatus } from '../../../ducks/promises'
import PromiseResult from '../../../misc/components/PromiseResult'
import ApplicationHeader from '../components/ApplicationHeader'
import CenteredMessage from '../../../misc/components/CenteredMessage'
import { visualizerConfigurator } from '../../visualizerConfigurators/routes'

class Application extends Component {
  static propTypes = {
    application: PropTypes.instanceOf(ApplicationModel).isRequired,
    visualizer: PropTypes.instanceOf(Visualizer).isRequired,
    applicationStatus: PropTypes.instanceOf(PromiseStatus).isRequired
  };

  componentWillMount() {
    this.loadVisualizerConfigurator(this.props);
  }

  componentWillReceiveProps(props) {
    this.loadVisualizerConfigurator(props);
  }

  loadVisualizerConfigurator(props) {
    // If there is no visualizer configurator loaded, we have to chose the right one and redirect
    // to the appropriate url.
    const { dispatch, application, visualizer, applicationStatus, children } = props;
    if (applicationStatus.done && !children) {
      dispatch(visualizerConfigurator(application.id, visualizer.uri));
    }
  }

  render() {
    const { application, visualizer, applicationStatus, children } = this.props;

    if (!applicationStatus.done) {
      return <PromiseResult status={applicationStatus} />
    }

    return <div>
      <Helmet title={application.name} />
      <ApplicationHeader application={application} visualizer={visualizer} />

      <br /><br />
      {!children &&
        <CenteredMessage>Loading visualizer configurator</CenteredMessage>}

      {children &&
        <CenteredMessage>
          {React.cloneElement(children, { application, visualizer })}
        </CenteredMessage>}
    </div>;
  }
}

const selector = createSelector(
  [applicationSelector, applicationVisualizerSelector, applicationStatusSelector],
  (application, visualizer, applicationStatus) => ({ application, visualizer, applicationStatus })
);
export default connect(selector)(Application);
