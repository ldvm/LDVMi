import React from 'react';
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import MaterialDialog from 'material-ui/lib/dialog';
import { dialogClose, dialogSelector } from '../modules/core/ducks/dialog'

const Dialog = (props) => {
  const {store, name, children, dispatch} = props;

  return (
    <MaterialDialog
      {...props}
      open={!!store.get(name)}
      onRequestClose={() => dispatch(dialogClose(name))}>
      {children}
    </MaterialDialog>
  );
};

const selector = createStructuredSelector({
  store: dialogSelector
});

export default connect(selector)(Dialog);
