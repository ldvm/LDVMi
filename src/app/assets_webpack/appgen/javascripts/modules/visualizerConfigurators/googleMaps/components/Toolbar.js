import React, { PropTypes } from 'react'
import IconMenu from 'material-ui/lib/menus/icon-menu'
import MenuItem from 'material-ui/lib/menus/menu-item'
import BodyPadding from '../../../../misc/components/BodyPadding'
import Button from '../../../../misc/components/Button'
import RefreshMapButton from '../containers/RefreshMapButton'
import PublishSettingsContainer from '../containers/PublishSettingsContainer'
import SaveButton from '../containers/SaveButton'

const Toolbar = () => {
  return <BodyPadding>
    <SaveButton />
    <RefreshMapButton  />
    <PublishSettingsContainer />
  </BodyPadding>
};

export default Toolbar;
