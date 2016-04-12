import React, { Component } from 'react'
import MaterialIconButton from 'material-ui/lib/icon-button';

// (The Material UI icon menu requires that the icon button is not a stateless component)
class IconButton extends Component {
  render() {
    const props = this.props;
    return (
      <MaterialIconButton {...props} iconClassName="material-icons">
        {props.icon}
      </MaterialIconButton>
    );
  }
}

export default IconButton;
