import React, { PropTypes } from 'react'
import TableRow from 'material-ui/lib/table/table-row'
import TableRowColumn from 'material-ui/lib/table/table-row-column'
import IconButton from '../../../components/IconButton'
import FromNow from '../../../components/FromNow'
import makePureRender from '../../../misc/makePureRender'
import * as createAppRoutes from '../../createApp/routes'
import withDialogControls from '../../core/containers/withDialogControls'
import ConfirmDialog from '../../core/containers/ConfirmDialog'
import { Discovery } from '../../createApp/models'
import TitleLink from './TitleLink'

// Each discovery has its own delete confirm dialog. It's not exactly nice but it works and is
// simple. We just have to give each dialog a different name.
const confirmDialogName = id => 'DELETE_APP_CONFIRM_DIALOG_' + id;

const DiscoveryRow = ({ discovery, deleteDiscovery, dialogOpen }) => (
  <TableRow>
    <TableRowColumn>
      <TitleLink to={createAppRoutes.discoveryUrl(discovery.id)}>{discovery.name}</TitleLink>
    </TableRowColumn>
    <TableRowColumn>here be status</TableRowColumn>
    <TableRowColumn>
      <strong>{discovery.pipelinesDiscoveredCount}</strong>
    </TableRowColumn>
    <TableRowColumn>
      <FromNow timestamp={discovery.modifiedUtc} />
    </TableRowColumn>
    <TableRowColumn style={{ width: '10%' }}>
      <ConfirmDialog danger
        dialogName={confirmDialogName(discovery.id)}
        message={`Do you really wish to delete this discovery?`}
        action={deleteDiscovery}
        icon="delete"
      />
      <IconButton
        icon="delete"
        onTouchTap={() => dialogOpen(confirmDialogName(discovery.id))}
      />
    </TableRowColumn>
  </TableRow>
);

DiscoveryRow.propTypes = {
  discovery: PropTypes.instanceOf(Discovery).isRequired,
  deleteDiscovery: PropTypes.func.isRequired,
  dialogOpen: PropTypes.func.isRequired
};

export default withDialogControls(makePureRender(DiscoveryRow));
