import React, { PropTypes } from 'react'
import CircularProgress from 'material-ui/lib/circular-progress'
import Icon from './Icon'

export const IN_PROGRESS = 0;
export const ERROR = 1;
export const SUCCESS = 2;

const circularSize = 0.343; // ~24px to match the icon size

// Unfortunately, the hard-coded minimal size of the CircularProgress's container is 50px,
// so we need to use this dirty little trick to squeeze it to the icon's size. (~24px).
const circularWrapperStyle = {
  width: '24px',
  height: '24px',
  display: 'inline-block',
  overflow: 'hidden'
};
const circularStyle = {
  marginLeft: '-12px',
  marginTop: '-12px'
};

const ProgressIndicator = ({ status }) => {
  switch (status) {
    case IN_PROGRESS: return (
      <div style={circularWrapperStyle}>
        <CircularProgress size={circularSize} style={circularStyle} />
      </div>);
    case ERROR: return <Icon icon="error" />;
    case SUCCESS: return <Icon icon="done" />;
    default: return <span />;
  }
};

ProgressIndicator.propTypes = {
  status: PropTypes.oneOf([IN_PROGRESS, ERROR, SUCCESS]).isRequired
};

export default ProgressIndicator;
