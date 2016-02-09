import React from 'react';
import { connect } from 'react-redux'
import Button from '../../../misc/components/Button'
import Dialog from '../../../containers/Dialog';
import { dialogClose } from '../../../ducks/dialog'

export const name = 'ADD_DATA_SOURCE_DIALOG';

const AddDataSourceDialog = (props) =>  {
  const { dialogClose } = props;

  const actions = [
    <Button label="Cancel" secondary={true}
      onTouchTap={dialogClose} />,
    <Button label="Submit" primary={true} keyboardFocused={true}
      onTouchTap={dialogClose} />
  ];

  return (
    <div>
      <Dialog name={name} title="Add new data source" actions={actions} modal={false}>
        The form will be here
      </Dialog>
    </div>
  );
};

export default connect(state => state, dispatch => ({
  dialogClose: () => dispatch(dialogClose(name))
}))(AddDataSourceDialog);