import React from 'react'
import Divider from 'material-ui/Divider';
import MaterialTheme from '../misc/materialTheme';

const spacing = MaterialTheme.spacing.desktopGutterLess + 'px';

const dividerStyle = {
  marginBottom: spacing,
  clear: 'both'
};

const ButtonBar = ({ left, right, divider }) => {
  return <div>
    {divider && <Divider style={dividerStyle} /> }
    <div style={{float: 'left'}}>
      {left}
    </div>
    <div style={{float: 'right'}}>
      {right}
    </div>
    <div style={{clear: 'both'}}></div>
  </div>

};

export default ButtonBar;
