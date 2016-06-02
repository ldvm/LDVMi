import React, { PropTypes } from 'react'
import MaterialTheme from '../misc/materialTheme'

const color = 'rgba(0, 0, 0, 0.7)';

const h2Style = {
  fontWeight: 400,
  color: color,
  marginTop: MaterialTheme.spacing.desktopGutterLess + 'px',
  marginBottom: MaterialTheme.spacing.desktopGutterLess + 'px'
};

const Subheadline = ({ title }) => <h2 style={h2Style}>{title}</h2>;

Subheadline.propTypes = {
  title: PropTypes.string.isRequired
};

export default Subheadline;
