import React from 'react'
import FontIcon from 'material-ui/lib/font-icon'
import RaisedButton from 'material-ui/lib/raised-button';
import FlatButon from 'material-ui/lib/flat-button';
import * as Theme from '../theme';
import { getColorType } from '../utils';

const Button = (props) => {
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
      newProps.labelStyle = { color: Theme[type] };
    }
  }

  return <Component {...newProps} />
};

export default Button;
