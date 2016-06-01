import React, { PropTypes } from 'react'
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import BodyPadding from '../../../../components/BodyPadding'
import Button from '../../../../components/Button'
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
