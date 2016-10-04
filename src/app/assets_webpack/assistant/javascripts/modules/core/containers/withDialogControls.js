import React from 'react'
import { connect } from 'react-redux'
import { dialogOpen, dialogClose } from '../ducks/dialog'

export default function withDialogControls(ComposedComponent) {
  const Wrapper = props =>
    <ComposedComponent
      dialogOpen={name => props.dispatch(dialogOpen(name))}
      dialogClose={name => props.dispatch(dialogClose(name))}
      {...props} />;

  return connect()(Wrapper);
};
