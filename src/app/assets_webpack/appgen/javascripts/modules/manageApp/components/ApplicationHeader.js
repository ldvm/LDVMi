import React, { Component, PropTypes } from 'react'
import { Application } from '../models'
import { Visualizer } from '../../core/models'
import Button from '../../../components/Button'
import Icon from '../../../components/Icon'
import BodyPadding from '../../../components/BodyPadding'
import PublishButton from '../containers/PublishButton'
import PreviewButton from './PreviewButton'

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

const ApplicationHeader = ({ application, visualizer, openGeneralSettingsDialog }) => {
  return <BodyPadding>
    <div style={buttonBarStyle}>
      <Button label="General settings" icon="settings" raised
        onTouchTap={openGeneralSettingsDialog}
      />
      <PreviewButton application={application} />
      <PublishButton />
      <Button label="Delete" icon="delete" raised danger />
    </div>

    <Icon icon={visualizer.icon} style={iconStyle} />
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
