import React, { Component } from 'react'
import FontIcon from 'material-ui/lib/font-icon'
import RaisedButton from 'material-ui/lib/raised-button';
import FlatButon from 'material-ui/lib/flat-button';
import * as Theme from '../misc/theme';
import { getColorType } from '../misc/utils';

// Cannot be a stateless component because in some special cases the component needs to accept
// the 'ref' attribute.
class Button extends Component {
  render() {
    const props = this.props;
    const Component = props.raised ? RaisedButton : FlatButon;
    const type = getColorType(props);

    let newProps = Object.assign({}, props);

    if (props.icon) {
      newProps.icon = <FontIcon className="material-icons">{props.icon}</FontIcon>;
    }

    if (type != 'default') {
      if (props.raised) {
        newProps.backgroundColor = Theme[type];
        newProps.labelColor = '#ffffff';
      } else {
        if (!props.disabled) {
          newProps.style = {color: Theme[type]};
        } else {
          newProps.style = {color: '#9e9e9e'};
        }
      }
    }

    return <Component {...newProps} />
  }
}

export default Button;
