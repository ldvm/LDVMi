import React from 'react';
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import MaterialDialog from 'material-ui/Dialog';
import { dialogClose, dialogSelector } from '../ducks/dialog'

const Dialog = (props) => {
  const {store, name, children, dispatch, width} = props;

  let newProps = Object.assign({}, props);

  // 'width' property has been deprecated but as I find it convenient, I add the support back.
  if (width) {
    newProps.width = null;
    newProps.contentStyle = Object.assign({}, props.contentStyle,
      { width: width + 'px', maxWidth: width + 'px' });
  }

  return (
    <MaterialDialog
      {...newProps}
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
