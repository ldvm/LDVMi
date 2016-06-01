import React, { PropTypes } from 'react'
import Paper from 'material-ui/Paper';
import ListsManagerContainer from '../containers/ListsManagerContainer'
import SelectedListManager from '../containers/SelectedListManager'
import { PublishSettings } from '../models'

const ConfiguratorSidebar = ({ publishSettings: { allowSwitchingLists, allowSelectingNodes }}) => {
  return (
    <Paper zDepth={2}>
      <ListsManagerContainer
        disableManaging
        disableSwitching={!allowSwitchingLists}
      />
      <SelectedListManager
        disableManaging
        disableSelecting={!allowSelectingNodes}
      />
    </Paper>
  )
};

ConfiguratorSidebar.propTypes = {
  publishSettings: PropTypes.instanceOf(PublishSettings).isRequired
};

export default ConfiguratorSidebar;
