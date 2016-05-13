import React, { Component, PropTypes } from 'react'
import { Application } from '../models'
import { Visualizer } from '../../core/models'
import BodyPadding from '../../../components/BodyPadding'
import Icon from '../../../components/Icon'
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

const appDescriptionStyle = {
  color: 'rgba(0, 0, 0, 0.6)'
};

const buttonBarStyle = {
  float: 'right'
};

const ApplicationHeader = ({ application, visualizer }) => {
  return <BodyPadding>
    <div style={buttonBarStyle}>
      <LanguageSwitch />
    </div>

    <Icon icon={visualizer.icon} style={iconStyle} />
    <h1 style={appNameStyle}>{application.name}</h1>
    <div style={appDescriptionStyle}>{application.description}</div>
  </BodyPadding>
};

ApplicationHeader.propTypes = {
  application: PropTypes.instanceOf(Application).isRequired,
  visualizer: PropTypes.instanceOf(Visualizer).isRequired
};

export default ApplicationHeader;
