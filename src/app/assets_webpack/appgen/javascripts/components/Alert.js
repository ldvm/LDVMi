import React from 'react'
import Paper from 'material-ui/Paper';
import Icon from './Icon'
import * as Theme from '../misc/theme';
import MaterialTheme from '../misc/materialTheme';
import { getColorType } from '../misc/utils';

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
    marginRight: '12px'
  };

  return <Paper style={alertStyles}>
    <Icon icon={icon} style={iconStyles} color="white" />
    {props.children}
  </Paper>
};

export default Alert;
