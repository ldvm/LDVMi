import React, { PropTypes } from 'react'
import IconMenu from 'material-ui/lib/menus/icon-menu'
import MenuItem from 'material-ui/lib/menus/menu-item'
import Button from '../../../../components/Button'
import { PublishSettings } from '../models'

const PublishSettingsMenu = ({ updatePublishSettings, publishSettings }) => {
  const { showLists, allowSwitchingLists, allowSelectingNodes } = publishSettings;

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
  </IconMenu>
};

PublishSettingsMenu.propTypes = {
  updatePublishSettings: PropTypes.func.isRequired,
  publishSettings: PropTypes.instanceOf(PublishSettings)
};

export default PublishSettingsMenu;
