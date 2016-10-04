import React, { PropTypes } from 'react'
import MaterialTheme from '../misc/materialTheme';

const Gap = ({ space }) => {
  const width = (MaterialTheme.spacing.desktopGutterMini * (space !== undefined ? space : 1)) + 'px';
  return <div style={{ width: width, display: 'inline-block' }}></div>
};

Gap.propTypes = {
  space: PropTypes.number
};

export default Gap;
