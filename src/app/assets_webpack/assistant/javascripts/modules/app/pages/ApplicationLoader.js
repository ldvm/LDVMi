import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import Helmet from 'react-helmet'
import { applicationSelector, createApplicationStatusSelector, applicationVisualizerSelector } from '../ducks/application'
import { Application as ApplicationModel } from '../models'
import { Visualizer } from '../../core/models'
import { PromiseStatus } from '../../core/models'
import PromiseResult from '../../core/components/PromiseResult'
import CenteredMessage from '../../../components/CenteredMessage'
import BodyPadding from '../../../components/BodyPadding'
import { getVisualizers } from '../../core/ducks/visualizers'
import { getApplication } from '../ducks/application'
import { getApplicationId } from '../../../window'

class ApplicationLoader extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    application: PropTypes.instanceOf(ApplicationModel).isRequired,
    visualizer: PropTypes.instanceOf(Visualizer).isRequired,
    applicationStatus: PropTypes.instanceOf(PromiseStatus).isRequired
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(getVisualizers());
    dispatch(getApplication(getApplicationId()));
  }

  render() {
    const { application, visualizer, applicationStatus, children } = this.props;

    if (!applicationStatus.done) {
      return <BodyPadding><PromiseResult status={applicationStatus} /></BodyPadding>
    }

    return <div>
      <Helmet
        title={application.name}
        titleTemplate="%s | LinkedPipes Visualization Assistant"
      />

      {children ?
        React.cloneElement(children, { application, visualizer }) :
        <CenteredMessage>Missing inner component</CenteredMessage>}
    </div>;
  }
}

const applicationStatusSelector = createApplicationStatusSelector(() => getApplicationId());

const selector = createSelector(
  [applicationSelector, applicationVisualizerSelector, applicationStatusSelector],
  (application, visualizer, applicationStatus) => ({ application, visualizer, applicationStatus })
);
export default connect(selector)(ApplicationLoader);
