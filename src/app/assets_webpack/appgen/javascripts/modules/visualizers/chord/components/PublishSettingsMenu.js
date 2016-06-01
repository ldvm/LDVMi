import React, { PropTypes } from 'react'
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Button from '../../../../components/Button'
import { PublishSettings, Graph } from '../models'

const PublishSettingsMenu = ({ updatePublishSettings, publishSettings, graph }) => {
  const { showLists, allowSwitchingLists, allowSelectingNodes, displayAsUndirected } = publishSettings;

  return <IconMenu
    iconButtonElement={<Button raised icon="settings" label="Publish settings" />}
    anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
    targetOrigin={{horizontal: 'right', vertical: 'top'}}
    desktop={true}
  >
    <MenuItem
      checked={showLists}
      onTouchTap={() => updatePublishSettings({ showLists: !showLists })}
      primaryText="Show lists"
      insetChildren={true}
    />
    <MenuItem
      checked={allowSwitchingLists}
      onTouchTap={() => updatePublishSettings({ allowSwitchingLists: !allowSwitchingLists })}
      primaryText="Allow switching lists"
      insetChildren={true}
    />
    <MenuItem
      checked={allowSelectingNodes}
      onTouchTap={() => updatePublishSettings({ allowSelectingNodes: !allowSelectingNodes })}
      primaryText="Allow selecting lists"
      insetChildren={true}
    />
    {graph.directed &&
      <MenuItem
        checked={displayAsUndirected}
        onTouchTap={() => updatePublishSettings({ displayAsUndirected: !displayAsUndirected })}
        primaryText="Symmetrical chords"
        insetChildren={true}
      />
    }
  </IconMenu>
};

PublishSettingsMenu.propTypes = {
  updatePublishSettings: PropTypes.func.isRequired,
  publishSettings: PropTypes.instanceOf(PublishSettings),
  graph: PropTypes.instanceOf(Graph)
};

export default PublishSettingsMenu;
