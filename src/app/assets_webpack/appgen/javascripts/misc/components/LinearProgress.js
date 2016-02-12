import React from 'react'
import MaterialLinearProgress from 'material-ui/lib/linear-progress';
import * as Theme from '../theme';
import MaterialTheme from '../materialTheme';
import { getColorType } from '../utils';

const LinearProgress = (props) => {
  const type = getColorType(props);
  const spacing = MaterialTheme.spacing.desktopGutterLess + 'px';
  const color = Theme[type];
  const style = {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    margin: spacing + ' 0'
  };

  return <MaterialLinearProgress {...props} style={style} color={color} />
};

export default LinearProgress;
