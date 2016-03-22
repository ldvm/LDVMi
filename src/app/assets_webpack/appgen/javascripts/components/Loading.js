import React from 'react'
import CircularProgress from 'material-ui/lib/circular-progress';
import MaterialTheme from '../misc/materialTheme';

const Loading = (props) => {
  const spacing = MaterialTheme.spacing.desktopGutterLess + 'px';

  const styles = {
    margin: spacing + ' 0'
  };

  const circleStyles = {
    float: 'left',
    marginRight: '8px'
  };

  const labelStyles = {
    lineHeight: '50px'
  };

  return <div style={styles}>
    <CircularProgress size={0.5} style={circleStyles} />
    <div style={labelStyles}>{props.children}</div>
  </div>
};

export default Loading;
