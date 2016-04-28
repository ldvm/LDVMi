import React, { Component } from 'react'
import MaterialIconButton from 'material-ui/lib/icon-button'
import Icon from './Icon'

// (The Material UI icon menu requires that the icon button is not a stateless component)
class IconButton extends Component {
  render() {
    let buttonProps = Object.assign({}, this.props);
    buttonProps.icon = undefined;
    buttonProps.color = undefined;
    return (
      <MaterialIconButton {...buttonProps}>
        <Icon icon={this.props.icon} color={this.props.color} />
      </MaterialIconButton>
    );
  }
}

export default IconButton;
