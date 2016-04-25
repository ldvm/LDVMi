import React, { PropTypes } from 'react'
import SaveButton from '../containers/SaveButton'
import PublishSettingsContainer from '../containers/PublishSettingsContainer'
import EmbedAppDialog from './../containers/EmbedAppDialog'
import OpenEmbedAppDialogButton from './OpenEmbedAppDialogButton'

const Toolbar = () => {
  return <div>
    <SaveButton />
    <OpenEmbedAppDialogButton />
    <PublishSettingsContainer />
    
    <EmbedAppDialog />
  </div>
};

export default Toolbar;
