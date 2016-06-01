import React, { PropTypes } from 'react'
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Button from '../../../../components/Button'
import { PublishSettings } from '../models'
import { updatePublishSettings } from '../ducks/publishSettings'

const PublishSettingsMenu = ({ updatePublishSettings, publishSettings }) => {
  const { refreshOnStartUp, showFilters, collapsibleFilters } = publishSettings;

  return <IconMenu
    iconButtonElement={<Button raised icon="settings" label="Publish settings" />}
    anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
    targetOrigin={{horizontal: 'right', vertical: 'top'}}
    desktop={true}
  >
    <MenuItem
      checked={refreshOnStartUp}
      onTouchTap={() => updatePublishSettings({ refreshOnStartUp: !refreshOnStartUp })}
      primaryText="Refresh on startup"
      insetChildren={true}
    />
    <MenuItem
      checked={showFilters}
      onTouchTap={() => updatePublishSettings({ showFilters: !showFilters })}
      primaryText="Show filters"
      insetChildren={true}
    />
    <MenuItem
      checked={collapsibleFilters}
      onTouchTap={() => updatePublishSettings({ collapsibleFilters: !collapsibleFilters })}
      primaryText="Allow filter collapsing"
      insetChildren={true}
    />
  </IconMenu>
};

PublishSettingsMenu.propTypes = {
  updatePublishSettings: PropTypes.func.isRequired,
  publishSettings: PropTypes.instanceOf(PublishSettings)
};

export default PublishSettingsMenu;
