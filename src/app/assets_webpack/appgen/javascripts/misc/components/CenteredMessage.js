import React from 'react'
import MaterialTheme from '../materialTheme';

const CenteredMessage = ({children}) => {
  const spacing = MaterialTheme.spacing.desktopGutterLess + 'px';

  const style = {
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.5)',
    padding: spacing
  };

  return <div style={style}>{children}</div>
};

export default CenteredMessage;
