import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import Helmet from 'react-helmet'
import { getApplication, getApplicationReset, applicationSelector, createApplicationStatusSelector, applicationVisualizerSelector } from '../ducks/application'
import { Application as ApplicationModel } from '../models'
import { Visualizer } from '../../core/models'
import { PromiseStatus } from '../../core/models'
import PromiseResult from '../../core/components/PromiseResult'
import ApplicationHeader from '../components/ApplicationHeader'
import GeneralSettings from '../containers/GeneralSettings'
import CenteredMessage from '../../../components/CenteredMessage'
import Alert from '../../../components/Alert'
import BodyPadding from '../../../components/BodyPadding'
import * as routes from '../../visualizers/routes'
import { dialogOpen } from '../../core/ducks/dialog'
import { dialogName as generalSettingsDialogName } from '../dialogs/GeneralSettingsDialog'
import requireSignedIn from '../../auth/containers/requireSignedIn'
import { userSelector } from '../../auth/ducks/user'
import { createRouteParamSelector } from '../../core/ducks/routing'
import { getVisualizers } from '../../core/ducks/visualizers'

class Application extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    applicationId: PropTypes.string.isRequired,
    application: PropTypes.instanceOf(ApplicationModel).isRequired,
    visualizer: PropTypes.instanceOf(Visualizer).isRequired,
    applicationStatus: PropTypes.instanceOf(PromiseStatus).isRequired
  };

  componentWillMount() {
    this.loadData(this.props);
    this.loadVisualizerConfigurator(this.props);
  }

  componentWillReceiveProps(props) {
    // In case the application id changes while this component is mounted, we need to reload the
    // application. Right now it's not happening anywhere (who knows if it even works...).
    const { application, applicationId, applicationStatus } = props;
    if (applicationStatus.done && application.id != applicationId) {
      this.loadData(props);
    }

    this.loadVisualizerConfigurator(props);
  }

  componentWillUnmount() {
    const { dispatch, applicationId } = this.props;
    dispatch(getApplicationReset(applicationId));
  }
  
  loadData(props) {
    const { dispatch, applicationId } = props;
    dispatch(getVisualizers());
    dispatch(getApplication(applicationId));
  }

  loadVisualizerConfigurator(props) {
    // If there is no visualizer configurator loaded, we have to chose the right one and redirect
    // to the appropriate url.
    const { dispatch, application, visualizer, applicationStatus, children } = props;
    if (applicationStatus.done && !children) {
      dispatch(routes.visualizerConfigurator(application.id, visualizer));
    }
  }

  render() {
    const { dispatch, user, application, visualizer, applicationStatus, children } = this.props;

    const openGeneralSettingsDialog = () => dispatch(dialogOpen(generalSettingsDialogName));

    if (!applicationStatus.done) {
      return <BodyPadding><PromiseResult status={applicationStatus} /></BodyPadding>
    }

    if (application.userId != user.id) {
      return <BodyPadding>
        <Alert danger>You're not permitted to access this application.</Alert>
      </BodyPadding>
    }

    return <div>
      <Helmet title={application.name} />
      <ApplicationHeader
        application={application}
        visualizer={visualizer}
        openGeneralSettingsDialog={openGeneralSettingsDialog}
      />
      <GeneralSettings application={application} />

      {!children &&
        <CenteredMessage>Loading visualizer configurator...</CenteredMessage>}

      {children && React.cloneElement(children, { application, visualizer })}
    </div>;
  }
}

// The application id is passed as URL parameter
const applicationIdSelector = createRouteParamSelector('id');
const applicationStatusSelector = createApplicationStatusSelector(applicationIdSelector);

const selector = createStructuredSelector({
  user: userSelector,
  applicationId: applicationIdSelector,
  application: applicationSelector,
  visualizer: applicationVisualizerSelector,
  applicationStatus: applicationStatusSelector
});

export default requireSignedIn(connect(selector)(Application));
