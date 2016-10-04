import React from 'react'
import MaterialTheme from '../misc/materialTheme';

const CenteredText = ({ children }) => {

  const style = {
    textAlign: 'center'
  };

  return <div style={style}>{children}</div>
};

export default CenteredText;
