import React from 'react';
import { connect } from 'react-redux'
import MaterialDialog from 'material-ui/lib/dialog';
import { dialogClose } from '../ducks/dialog'

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

export default connect(state => ({
  store: state.dialog
}))(Dialog);
