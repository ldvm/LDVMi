import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import Helmet from 'react-helmet'
import { getApplication, getApplicationReset, deleteApplication, applicationSelector, createApplicationStatusSelector, applicationVisualizerSelector } from '../ducks/application'
import { Application as ApplicationModel } from '../models'
import { Visualizer } from '../../core/models'
import { PromiseStatus } from '../../core/models'
import PromiseResult from '../../core/components/PromiseResult'
import ConfiguratorHeader from '../components/ConfiguratorHeader'
import GeneralSettings from '../containers/GeneralSettings'
import DeleteAppConfirmDialog, { dialogName as deleteAppConfirmDialogName } from '../dialogs/DeleteAppConfirmDialog'
import LabelEditor from '../containers/LabelEditor'
import CenteredMessage from '../../../components/CenteredMessage'
import Alert from '../../../components/Alert'
import BodyPadding from '../../../components/BodyPadding'
import * as routes from '../../visualizers/routes'
import * as dashboardRoutes from '../../dashboard/routes'
import { dialogOpen } from '../../core/ducks/dialog'
import { dialogName as generalSettingsDialogName } from '../dialogs/GeneralSettingsDialog'
import requireSignedIn from '../../auth/containers/requireSignedIn'
import { userSelector } from '../../auth/ducks/user'
import { createRouteParamSelector } from '../../core/ducks/routing'
import { getVisualizers, visualizersStatusSelector } from '../../core/ducks/visualizers'
import { createAggregatedPromiseStatusSelector} from '../../core/ducks/promises'

class ConfiguratorLoader extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    applicationId: PropTypes.string.isRequired,
    application: PropTypes.instanceOf(ApplicationModel).isRequired,
    visualizer: PropTypes.instanceOf(Visualizer).isRequired,
    status: PropTypes.instanceOf(PromiseStatus).isRequired
  };

  componentWillMount() {
    this.loadData(this.props);
    this.loadVisualizerConfigurator(this.props);
  }

  componentWillReceiveProps(props) {
    // In case the application id changes while this component is mounted, we need to reload the
    // application. Note that applicationId is the URL param and application is currently loaded
    // application. If they differ, we need to load the proper application.
    const { application, applicationId, status } = props;
    if (!status.isLoading && application.id != applicationId) {
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
    const { dispatch, application, visualizer, status, children } = props;
    if (status.done && !children) {
      dispatch(routes.visualizerConfigurator(application.id, visualizer));
    }
  }

  render() {
    const { dispatch, user, application, visualizer, status, children } = this.props;

    if (!status.done) {
      return <BodyPadding><PromiseResult status={status} /></BodyPadding>
    }

    {/* This should be actually already protected by the backend... */}
    if (application.userId != user.id && !user.isAdmin) {
      return <BodyPadding>
        <Alert danger>You're not permitted to access this application.</Alert>
      </BodyPadding>
    }

    return <div>
      <Helmet title={application.name} />
      <ConfiguratorHeader
        application={application}
        visualizer={visualizer}
        openGeneralSettingsDialog={() => dispatch(dialogOpen(generalSettingsDialogName))}
        openDeleteAppConfirmDialog={() => dispatch(dialogOpen(deleteAppConfirmDialogName))}
      />
      <GeneralSettings application={application} />
      <DeleteAppConfirmDialog
        application={application}
        deleteApplication={() => dispatch(deleteApplication(application.id, dashboardRoutes.dashboard()))} />
      <LabelEditor />

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
  status: createAggregatedPromiseStatusSelector([
    applicationStatusSelector,
    visualizersStatusSelector
  ])
});

export default requireSignedIn(connect(selector)(ConfiguratorLoader));
