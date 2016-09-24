import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Dialog from './Dialog'
import { dialogClose } from '../ducks/dialog'
import Button from '../../../components/Button'

const ConfirmDialog = ({ dispatch, dialogName, message, action, danger, icon }) => {
  const close = () => dispatch(dialogClose(dialogName));
  const confirm = ()  => {
    action();
    close();
  };

  const actions = [
    <Button label="Cancel" onTouchTap={close} />,
    <Button
      label="Confirm"
      success={!danger}
      danger={!!danger}
      raised
      icon={icon || 'done'}
      onTouchTap={confirm} />
  ];

  return (
    <Dialog name={dialogName} title="Confirm action" actions={actions}>
      {message}
    </Dialog>
  );
};

ConfirmDialog.propTypes = {
  dispatch: PropTypes.func.isRequired,
  dialogName: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
  danger: PropTypes.bool,
  icon: PropTypes.string
};

export default connect()(ConfirmDialog);
