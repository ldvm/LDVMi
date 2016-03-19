import React, { Component, PropTypes } from 'react'
import FontIcon from 'material-ui/lib/font-icon';
import { Application } from '../models'
import { Visualizer } from '../../common/models'
import Button from '../../../misc/components/Button'
import BodyPadding from '../../../misc/components/BodyPadding'

const iconStyle = {
  float: 'left',
  fontSize: '3em',
  width: '1.3em',
  overflow: 'hidden'
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

const ApplicationHeader = ({ application, visualizer, openGeneralSettingsDialog }) => {
  return <BodyPadding>
    <div style={buttonBarStyle}>
      <Button label="General settings" icon="settings" raised
        onTouchTap={openGeneralSettingsDialog}
      />
      <Button label="Preview" icon="find_in_page" raised />
      <Button label="Publish" icon="screen_share" raised success />
      <Button label="Delete" icon="delete" raised danger />
    </div>

    <FontIcon className="material-icons" style={iconStyle}>{visualizer.icon}</FontIcon>
    <h1 style={appNameStyle}>{application.name}</h1>
    <div style={visualizerNameStyle}>{visualizer.title}</div>
  </BodyPadding>
};

ApplicationHeader.propTypes = {
  application: PropTypes.instanceOf(Application).isRequired,
  visualizer: PropTypes.instanceOf(Visualizer).isRequired,
  openGeneralSettingsDialog: PropTypes.func.isRequired
};

export default ApplicationHeader;
