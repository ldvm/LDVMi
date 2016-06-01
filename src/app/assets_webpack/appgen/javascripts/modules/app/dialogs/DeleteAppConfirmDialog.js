import React, { PropTypes } from 'react'
import prefix from '../prefix'
import { Application } from '../models'
import ConfirmDialog from '../../core/containers/ConfirmDialog'

export const dialogName = prefix('DELETE_APP_CONFIRM_DIALOG');

const DeleteAppConfirmDialog = ({ application, deleteApplication }) => (
  <ConfirmDialog danger
     dialogName={dialogName}
     message={`Do you really wish to delete the application "${application.name}"?`}
     action={deleteApplication}
     icon="delete"
  />
);

DeleteAppConfirmDialog.propTypes = {
  application: PropTypes.instanceOf(Application).isRequired,
  deleteApplication: PropTypes.func.isRequired
};

export default DeleteAppConfirmDialog;
