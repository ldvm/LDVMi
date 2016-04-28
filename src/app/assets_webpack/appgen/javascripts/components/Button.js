import React, { Component } from 'react'
import RaisedButton from 'material-ui/lib/raised-button';
import FlatButon from 'material-ui/lib/flat-button';
import * as Theme from '../misc/theme';
import { getColorType } from '../misc/utils';
import Icon from './Icon'

// Cannot be a stateless component because in some special cases the component needs to accept
// the 'ref' attribute.
class Button extends Component {
  render() {
    const props = this.props;
    const Component = props.raised ? RaisedButton : FlatButon;
    const type = getColorType(props);

    let newProps = Object.assign({}, props);

    if (props.icon) {
      newProps.icon = <Icon icon={props.icon} />;
    }
    if (props.image) {
      newProps.icon = <img src={props.image} width={32} height={32} />;
    }

    if (type != 'default') {
      if (props.raised) {
        newProps.backgroundColor = Theme[type];
        newProps.labelColor = '#ffffff';
      } else {
        if (!props.disabled) {
          newProps.style = { color: Theme[type] };
        } else {
          newProps.style = { color: '#9e9e9e' };
        }
      }
    } else {
      if (!props.raised && props.inverted) {
        newProps.style = { color: props.disabled ? '#eaeaea' : '#ffffff' }
      }
    }


    return <Component {...newProps} />
  }
}

export default Button;
