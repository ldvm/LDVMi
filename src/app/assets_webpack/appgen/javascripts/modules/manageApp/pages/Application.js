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

const Application = ({ application, visualizer, applicationStatus }) => {
  if (!applicationStatus.done) {
    return <PromiseResult status={applicationStatus} />
  }
  return <div>
      <Helmet title={application.name} />
      <h1>{application.name}</h1>
      <strong>{visualizer.title}</strong>
    </div>;
};

Application.propTypes = {
  application: PropTypes.instanceOf(ApplicationModel).isRequired,
  visualizer: PropTypes.instanceOf(Visualizer).isRequired,
  applicationStatus: PropTypes.instanceOf(PromiseStatus).isRequired
};

const selector = createSelector(
  [applicationSelector, applicationVisualizerSelector, applicationStatusSelector],
  (application, visualizer, applicationStatus) => ({ application, visualizer, applicationStatus })
);
export default connect(selector)(Application);
