import React, { PropTypes } from 'react'
import Button from '../../../../components/Button'
import withDialogControls from '../../../core/containers/withDialogControls'
import { dialogName } from '../containers/SearchDialog'

const OpenSearchDialogButton = props => (
  <Button success raised
     onTouchTap={() => props.dialogOpen(dialogName)}
     icon="add"
     label="Add items to this list"
     {...props}
  />
);

OpenSearchDialogButton.propTypes = {
  dialogOpen: PropTypes.func.isRequired
};

export default withDialogControls(OpenSearchDialogButton);
