import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import IconButton from '../../../../components/IconButton'
import ConfirmDialog from '../../../core/containers/ConfirmDialog'
import { dialogOpen } from '../../../core/ducks/dialog'
import prefix from '../prefix'
import { NodeList } from '../models'

export const dialogName = prefix('REMOVE_LIST_DIALOG');

const RemoveListDialog = ({ dispatch, list, removeList }) => {
  return (
    <span>
      <IconButton icon='delete'
        iconStyle={{ color: 'white '}}
        onTouchTap={() => dispatch(dialogOpen(dialogName))} />
      <ConfirmDialog
        dialogName={dialogName}
        message="Do you wish to remove this list?"
        action={() => removeList(list.id)}
      />
    </span>
  );
};


RemoveListDialog.propTypes = {
  dispatch: PropTypes.func.isRequired,
  list: PropTypes.instanceOf(NodeList).isRequired,
  removeList: PropTypes.func.isRequired
};

export default connect()(RemoveListDialog);
