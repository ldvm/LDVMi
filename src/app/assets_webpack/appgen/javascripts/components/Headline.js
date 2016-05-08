import React, { PropTypes } from 'react'
import MaterialTheme from '../misc/materialTheme'
import Icon from './Icon'

const color = 'rgba(0, 0, 0, 0.7)';

const divStyle = {
};

const iconStyle = {
  float: 'left',
  height: '2.2em',
  width: '2.2em',
  margin: '0.2em 0.7em 0 0'
};

const h1Style = {
  fontWeight: 300,
  color: color,
  marginTop: MaterialTheme.spacing.desktopGutterLess + 'px',
  marginBottom: 2 * MaterialTheme.spacing.desktopGutterLess + 'px'
};

const Headline = ({ title, icon }) =>
  <div style={divStyle}>
    {icon && <Icon icon={icon} style={iconStyle} color={color} />}
    <h1 style={h1Style}>{title}</h1>
  </div>;

Headline.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string
};

export default Headline;
