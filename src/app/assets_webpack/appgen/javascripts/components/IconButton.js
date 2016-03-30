import React from 'react'
import MaterialIconButton from 'material-ui/lib/icon-button';

const IconButton = props => (
  <MaterialIconButton {...props} iconClassName="material-icons">
    {props.icon}
  </MaterialIconButton>
);

export default IconButton;
