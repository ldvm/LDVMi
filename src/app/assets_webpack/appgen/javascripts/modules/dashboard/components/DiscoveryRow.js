import React, { PropTypes } from 'react'
import TableRow from 'material-ui/lib/table/table-row'
import TableRowColumn from 'material-ui/lib/table/table-row-column'
import IconMenu from 'material-ui/lib/menus/icon-menu'
import { Link } from 'react-router'
import moment from 'moment'
import IconButton from '../../../components/IconButton'
import MenuItem from '../../../components/MenuItem'
import makePureRender from '../../../misc/makePureRender'
import * as createAppRoutes from '../../createApp/routes'
import withDialogControls from '../../core/containers/withDialogControls'
import ConfirmDialog from '../../core/containers/ConfirmDialog'
import { Discovery } from '../../createApp/models'

// Each discovery has its own delete confirm dialog. It's not exactly nice but it works and is
// simple. We just have to give each dialog a different name.
const confirmDialogName = id => 'DELETE_APP_CONFIRM_DIALOG_' + id;

const DiscoveryRow = ({ discovery, deleteDiscovery, dialogOpen }) => (
  <TableRow>
    <TableRowColumn>
      <Link to={createAppRoutes.discoveryUrl(discovery.id)}>{discovery.name} </Link>
    </TableRowColumn>
    <TableRowColumn>here be status</TableRowColumn>
    <TableRowColumn><strong>{discovery.pipelinesDiscoveredCount}</strong></TableRowColumn>
    <TableRowColumn>{moment(discovery.modifiedUtc).fromNow()}</TableRowColumn>
    <TableRowColumn style={{ width: '10%' }}>
      
      {/* The confirm dialog has to be outside of the IconMenu to work properly. That is why we
          cannot extract the confirm dialog with the delete button into a separate component. */}
      <ConfirmDialog danger
        dialogName={confirmDialogName(discovery.id)}
        message={`Do you really wish to delete this discovery?`}
        action={deleteDiscovery}
        icon="delete"
      />
      <IconMenu
         iconButtonElement={<IconButton icon="more_vert" />}
         anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
         targetOrigin={{horizontal: 'right', vertical: 'top'}}
         closeOnItemTouchTap={true}
       >
        <Link to={createAppRoutes.discoveryUrl(discovery.id)}>
          <MenuItem primaryText="Open" icon="open_in_browser" />
        </Link>
        <MenuItem
          primaryText="Delete"
          icon="delete"
          onTouchTap={() => dialogOpen(confirmDialogName(discovery.id))}
        />
      </IconMenu>
    </TableRowColumn>
  </TableRow>
);

DiscoveryRow.propTypes = {
  discovery: PropTypes.instanceOf(Discovery).isRequired,
  deleteDiscovery: PropTypes.func.isRequired,
  dialogOpen: PropTypes.func.isRequired
};

export default withDialogControls(makePureRender(DiscoveryRow));
