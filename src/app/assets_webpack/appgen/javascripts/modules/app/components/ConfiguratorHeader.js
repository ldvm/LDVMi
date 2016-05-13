import React, { PropTypes } from 'react'
import IconMenu from 'material-ui/lib/menus/icon-menu'
import MenuItem from 'material-ui/lib/menus/menu-item'
import { Application } from '../models'
import { Visualizer } from '../../core/models'
import Button from '../../../components/Button'
import Icon from '../../../components/Icon'
import Gap from '../../../components/Gap'
import BodyPadding from '../../../components/BodyPadding'
import PublishButton from '../containers/PublishButton'
import PreviewButton from './PreviewButton'
import ToggleLabelEditorButton from '../containers/ToggleLabelEditorButton'
import LanguageSwitch from '../containers/LanguageSwitch'

const iconStyle = {
  float: 'left',
  height: '2.5em',
  width: '2.5em',
  margin: '0.3em 0.8em 0 0'
};

const appNameStyle = {
  fontWeight: 300,
  margin: 0
};

const visualizerNameStyle = {
  color: 'rgba(0, 0, 0, 0.6)'
};

const buttonBarStyle = {
  float: 'right'
};

const ConfiguratorHeader = ({ application, visualizer, openGeneralSettingsDialog }) => {
  return <BodyPadding>
    <div style={buttonBarStyle}>
      <LanguageSwitch />
      <Gap space={2} />
      <PreviewButton application={application} />
      <PublishButton />
      <IconMenu
        iconButtonElement={<Button raised icon="expand_more" label="More" />}
        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
      >
        <MenuItem
          primaryText="General settings"
          leftIcon={<Icon icon="settings" />}
          onTouchTap={openGeneralSettingsDialog}
        />
        <ToggleLabelEditorButton />
        <MenuItem
          primaryText="Delete"
          leftIcon={<Icon icon="delete" />}
        />
      </IconMenu>
    </div>

    <Icon icon={visualizer.icon} style={iconStyle} />
    <h1 style={appNameStyle}>{application.name}</h1>
    <div style={visualizerNameStyle}>{visualizer.title}</div>
  </BodyPadding>
};

ConfiguratorHeader.propTypes = {
  application: PropTypes.instanceOf(Application).isRequired,
  visualizer: PropTypes.instanceOf(Visualizer).isRequired,
  openGeneralSettingsDialog: PropTypes.func.isRequired
};

export default ConfiguratorHeader;
