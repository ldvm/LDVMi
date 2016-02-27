import React from 'react'
import FontIcon from 'material-ui/lib/font-icon'
import Paper from 'material-ui/lib/paper';
import * as Theme from '../theme';
import MaterialTheme from '../materialTheme';
import { getColorType } from '../utils';

const icons = {
  success: 'check',
  info: 'info',
  warning: 'warning',
  danger: 'error'
};

const Alert = (props) => {
  const type = getColorType(props);
  const icon = icons[type] || 'check';
  const spacing = MaterialTheme.spacing.desktopGutterLess + 'px';

  const alertStyles = {
    backgroundColor: Theme[type],
    color: '#ffffff',
    marginTop: spacing,
    marginBottom: spacing,
    padding: '12px',
    textAlign: 'left'
  };

  const iconStyles = {
    float: 'left',
    marginRight: '12px',
    color: '#ffffff'
  };

  return <Paper style={alertStyles}>
    <FontIcon className="material-icons" style={iconStyles}>{icon}</FontIcon>
    {props.children}
  </Paper>
};

export default Alert;
