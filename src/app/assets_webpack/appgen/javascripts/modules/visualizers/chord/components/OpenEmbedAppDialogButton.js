import React, { PropTypes } from 'react'
import Button from '../../../../components/Button'
import withDialogControls from '../../../core/containers/withDialogControls'
import { dialogName } from './../containers/EmbedAppDialog'

const OpenSearchDialogButton = props => (
  <Button default raised
     onTouchTap={() => props.dialogOpen(dialogName)}
     icon="code"
     label="Embed"
     {...props}
  />
);

OpenSearchDialogButton.propTypes = {
  dialogOpen: PropTypes.func.isRequired
};

export default withDialogControls(OpenSearchDialogButton);
