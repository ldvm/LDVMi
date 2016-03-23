import React, { Component, PropTypes } from 'react'
import FontIcon from 'material-ui/lib/font-icon';
import { Application } from '../../manageApp/models'
import { Visualizer } from '../../core/models'
import BodyPadding from '../../../components/BodyPadding'

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

const appDescriptionStyle = {
  color: 'rgba(0, 0, 0, 0.6)'
};

const ApplicationHeader = ({ application, visualizer }) => {
  return <BodyPadding>
    <FontIcon className="material-icons" style={iconStyle}>{visualizer.icon}</FontIcon>
    <h1 style={appNameStyle}>{application.name}</h1>
    <div style={appDescriptionStyle}>{application.description}</div>
  </BodyPadding>
};

ApplicationHeader.propTypes = {
  application: PropTypes.instanceOf(Application).isRequired,
  visualizer: PropTypes.instanceOf(Visualizer).isRequired
};

export default ApplicationHeader;
