import React, { Component } from 'react'
import MaterialMenuItem from 'material-ui/lib/menus/menu-item'
import Icon from './Icon'

const style = {
  // Remove underline from the text (in case the MenuItem is wrapped by <a />)
  display: 'inline-block',
  textDecoration: 'none'
};

// (The Material UI icon menu requires that the icon button is not a stateless component)
class MenuItem extends Component {
  render() {
    const props = this.props;
    const newProps = Object.assign({},
      props,
      { primaryText: <span style={style}>{props.primaryText}</span> },
      props.icon ? { leftIcon: <Icon icon={props.icon} /> } : { }
    );

    return <MaterialMenuItem {...newProps} />
  }
}

export default MenuItem;
