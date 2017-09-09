import React, { PropTypes } from 'react'
import Application from '../containers/Application'
import { Application as ApplicationModel } from '../../../app/models'
import { Visualizer } from '../../../core/models'
import ApplicationHeader from '../../../app/components/ApplicationHeader'

const Standalone = ({ application, visualizer }) => <div>
  <ApplicationHeader application={application} visualizer={visualizer}/>
  <Application />
</div>;

Standalone.propTypes = {
  // As the component is at first initialized by the router, these props might not be available
  // (that's why they are not required). But once the component is actually mounted, both props
  // are properly there (injected from the Loader).
  application: PropTypes.instanceOf(ApplicationModel),
  visualizer: PropTypes.instanceOf(Visualizer)
};

export default Standalone;
