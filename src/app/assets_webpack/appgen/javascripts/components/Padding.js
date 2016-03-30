import React, { PropTypes } from 'react'
import MaterialTheme from '../misc/materialTheme';

const Padding = ({ children, space }) => {
  const padding = (MaterialTheme.spacing.desktopGutterMini * (space !== undefined ? space : 1)) + 'px';
  return <div style={{ padding: padding }}>{children}</div>
};

Padding.propTypes = {
  space: PropTypes.number
};

export default Padding;
