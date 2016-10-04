import React from 'react'
import materialTheme from '../misc/materialTheme'

const margin =  '-' + materialTheme.spacing.desktopGutter + 'px';
const auto = 'auto';

const makeStyle = props => {
  const { horizontal, vertical, left, right, top, bottom } = props;

  return {
    marginTop: (vertical || top) ? margin : auto,
    marginBottom: (vertical || bottom) ? margin : auto,
    marginLeft: (horizontal || left) ? margin : auto,
    marginRight: (horizontal || right) ? margin : auto
  }
};

const IgnoreDialogPadding = props => (
  <div style={makeStyle(props)}>{props.children}</div>
);

export default IgnoreDialogPadding;
