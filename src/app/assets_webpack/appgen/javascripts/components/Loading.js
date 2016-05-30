import React from 'react'
import RefreshIndicator from 'material-ui/lib/refresh-indicator';
import MaterialTheme from '../misc/materialTheme';
import * as theme from '../misc/theme'

const Loading = (props) => {
  const spacing = MaterialTheme.spacing.desktopGutterLess + 'px';

  const containerStyle = {
    margin: spacing + ' 0',
    position: 'relative',
    lineHeight: '50px'
  };

  const circleStyles = {
    display: 'inline-block',
    position: 'relative'
  };

  const labelStyles = {
    display: 'inline-block',
    position: 'relative',
    left: '15px',
    top: '-10px',
    color: '#8a8a8a'
  };

  return <div style={containerStyle}>
    <RefreshIndicator
      size={40}
      left={0}
      top={0}
      loadingColor={theme.warning}
      status="loading"
      style={circleStyles}
    />
    <div style={labelStyles}>{props.children}</div>
  </div>
};

export default Loading;
