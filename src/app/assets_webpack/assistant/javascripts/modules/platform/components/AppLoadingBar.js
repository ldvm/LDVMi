import React from 'react'
import LinearProgress from 'material-ui/LinearProgress'

const containerStyle = {
  position: 'relative'
};

const progressStyle = {
  position: 'absolute',
  width: '100%',
  zIndex: 9999,
  backgroundColor: 'transparent'
};

const AppLoadingBar = () => (
  <div style={containerStyle}>
    <LinearProgress style={progressStyle} mode="indeterminate" color="#ffffff" />
  </div>);

export default AppLoadingBar;
