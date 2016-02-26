import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import Helmet from 'react-helmet'
import { Link } from 'react-router'
import { applicationSelector, applicationStatusSelector } from '../ducks/application'
import { Application as ApplicationModel } from '../models'
import { PromiseStatus } from '../../../ducks/promises'
import PromiseResult from '../../../misc/components/PromiseResult'

const Application = ({ application, applicationStatus }) => {
  if (!applicationStatus.done) {
    return <PromiseResult status={applicationStatus} />
  }
  return <div>
      <Helmet title={application.name} />
      <h1>{application.name}</h1>
    </div>;
};

Application.propTypes = {
  application: PropTypes.instanceOf(ApplicationModel).isRequired,
  applicationStatus: PropTypes.instanceOf(PromiseStatus).isRequired
};

const selector = createSelector(
  [applicationSelector, applicationStatusSelector],
  (application, applicationStatus) => ({ application, applicationStatus })
);
export default connect(selector)(Application);
