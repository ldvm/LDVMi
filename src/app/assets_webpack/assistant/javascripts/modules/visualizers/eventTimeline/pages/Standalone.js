import React, { PropTypes } from 'react'
import Application from '../components/Application'
import ApplicationHeader from '../../../app/components/ApplicationHeader'

const Standalone = props => (
    <div>
        <ApplicationHeader {...props} />
        <Application {...props} />
    </div>
);

export default Standalone;