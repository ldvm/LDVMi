import React from 'react'
import FontIcon from 'material-ui/lib/font-icon'
import RaisedButton from 'material-ui/lib/raised-button';
import FlatButon from 'material-ui/lib/flat-button';

const Button = (props) => {
  const Component = props.raised ? RaisedButton : FlatButon;

  return <Component
    {...props}
    icon={props.icon ? <FontIcon className="material-icons">{props.icon}</FontIcon> : null}
  />
};

export default Button;
