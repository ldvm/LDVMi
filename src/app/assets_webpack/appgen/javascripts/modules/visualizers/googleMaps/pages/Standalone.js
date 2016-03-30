import React, { PropTypes } from 'react'
import Application from '../containers/Application'
import { Application as ApplicationModel } from '../../../manageApp/models'
import { Visualizer } from '../../../core/models'
import ApplicationHeader from '../../../publishedApp/components/ApplicationHeader'

const Standalone = ({ application, visualizer }) => <div>
    <ApplicationHeader application={application} visualizer={visualizer} />
    <Application />
  </div>;

Standalone.propTypes = {
  application: PropTypes.instanceOf(ApplicationModel).isRequired,
  visualizer: PropTypes.instanceOf(Visualizer).isRequired
};

export default Standalone;
