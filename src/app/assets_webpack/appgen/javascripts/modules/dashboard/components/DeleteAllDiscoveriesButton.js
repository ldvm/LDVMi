import React, { PropTypes } from 'react'
import Button from '../../../components/Button'
import withDialogControls from '../../core/containers/withDialogControls'
import ConfirmDialog from '../../core/containers/ConfirmDialog'

const confirmDialogName = 'DELETE_ALL_DISCOVERIES_CONFIRM_DIALOG';

const DeleteAllDiscoveriesButton = ({ deleteAllDiscoveries, dialogOpen }) => (
  <div>
    <Button danger raised
      label="Delete all"
      icon="delete"
      onTouchTap={() => dialogOpen(confirmDialogName)}
    />
    <ConfirmDialog danger
      dialogName={confirmDialogName}
      message={`Do you really wish to delete all your discoveries?`}
      action={deleteAllDiscoveries}
      icon="delete"
    />
  </div>
);

DeleteAllDiscoveriesButton.propTypes = {
  deleteAllDiscoveries: PropTypes.func.isRequired,
  dialogOpen: PropTypes.func.isRequired
};

export default withDialogControls(DeleteAllDiscoveriesButton);
