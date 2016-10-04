import React from 'react'

const style = {
  textAlign: 'center',
  marginTop: '100px',
  color: 'rgba(0, 0, 0, 0.5)'
};

const VisualizationMessage = ({ children }) => (
  <div style={style}>
    {children}
    </div>
);

export default VisualizationMessage;
