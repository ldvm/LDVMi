import React, { PropTypes } from 'react'
import SaveButton from '../containers/SaveButton'
import PublishSettingsContainer from '../containers/PublishSettingsContainer'

const Toolbar = () => {
  return <div>
    <SaveButton />
    <PublishSettingsContainer />
  </div>
};

export default Toolbar;
