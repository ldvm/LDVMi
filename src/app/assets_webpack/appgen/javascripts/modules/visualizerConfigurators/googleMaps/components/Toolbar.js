import React, { PropTypes } from 'react'
import IconMenu from 'material-ui/lib/menus/icon-menu'
import MenuItem from 'material-ui/lib/menus/menu-item'
import BodyPadding from '../../../../misc/components/BodyPadding'
import Button from '../../../../misc/components/Button'
import RefreshMapButton from '../containers/RefreshMapButton'

const Toolbar = () => {
  return <BodyPadding>
    <Button success raised icon="done" label="Save changes" />
    <RefreshMapButton  />

    <IconMenu
      iconButtonElement={<Button raised icon="settings" label="Publish settings" />}
      anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
      targetOrigin={{horizontal: 'left', vertical: 'top'}}
      maxHeight={272}
    >
      <MenuItem value="AL" primaryText="Alabama"/>
      <MenuItem value="AK" primaryText="Alaska"/>
      <MenuItem value="AZ" primaryText="Arizona"/>
    </IconMenu>
  </BodyPadding>
};

export default Toolbar;
