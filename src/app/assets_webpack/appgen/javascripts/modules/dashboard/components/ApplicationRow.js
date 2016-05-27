import React, { PropTypes } from 'react'
import TableRow from 'material-ui/lib/table/table-row'
import TableRowColumn from 'material-ui/lib/table/table-row-column'
import IconMenu from 'material-ui/lib/menus/icon-menu'
import { Link } from 'react-router'
import Icon from '../../../components/Icon'
import IconButton from '../../../components/IconButton'
import MenuItem from '../../../components/MenuItem'
import makePureRender from '../../../misc/makePureRender'
import { Application } from '../../app/models'
import { Visualizer } from '../../core/models'
import * as applicationRoutes from '../../app/applicationRoutes'
import * as configuratorRoutes from '../../app/configuratorRoutes'
import * as theme from '../../../misc/theme'
import withDialogControls from '../../core/containers/withDialogControls'
import ConfirmDialog from '../../core/containers/ConfirmDialog'

const iconStyle = {
  float: 'left',
  margin: '0.2em 0.6em 0 0'
};

const h3Style = {
  margin: '12px 0 0 0',
  fontWeight: 'normal',
  fontSize: '1.3em'
};

const linkStyle = {
  textDecoration: 'none'
};

const descriptionStyle = {
  color: '#9e9e9e',
  marginBottom: '12px',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
};

// Each application has its own delete confirm dialog. It's not exactly nice but it works and is
// simply. We just have to give each dialog a different name.
const confirmDialogName = id => 'DELETE_APP_CONFIRM_DIALOG_' + id;

const ApplicationRow = ({ application, visualizer, deleteApplication, dialogOpen }) => (
  <TableRow>
    <TableRowColumn style={{ width: '60%' }}>
      <h3 style={h3Style}>
        {visualizer &&
          <Icon icon={visualizer.icon} style={iconStyle} color="#333333" />
        }
        <Link style={linkStyle} to={configuratorRoutes.applicationUrl(application.id)}>
          {application.name}
        </Link>
      </h3>
      <div style={descriptionStyle}>
        {application.description}
      </div>
    </TableRowColumn>
    <TableRowColumn>
      {visualizer && visualizer.title}
    </TableRowColumn>
    <TableRowColumn style={{ width: '10%' }}>
      {application.published && <Icon icon="done" color={theme.success} />}
    </TableRowColumn>
    <TableRowColumn style={{ width: '10%' }}>
      <ConfirmDialog danger
        dialogName={confirmDialogName(application.id)}
        message={`Do you really wish to delete the application "${application.name}"?`}
        action={deleteApplication}
        icon="delete"
      />
      <IconMenu
         iconButtonElement={<IconButton icon="more_vert" />}
         anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
         targetOrigin={{horizontal: 'right', vertical: 'top'}}
         closeOnItemTouchTap={true}
       >
        <Link to={configuratorRoutes.applicationUrl(application.id)}>
          <MenuItem primaryText="Configure" icon="mode_edit" />
        </Link>
        <a href={applicationRoutes.applicationUrl(application)} target="_blank">
          {application.published ?
            <MenuItem primaryText="Open" icon="open_in_browser" /> :
            <MenuItem primaryText="Preview" icon="find_in_page" />}
        </a>
        <MenuItem
          primaryText="Delete"
          icon="delete"
          onTouchTap={() => dialogOpen(confirmDialogName(application.id))}
        />
      </IconMenu>
    </TableRowColumn>
  </TableRow>
);

ApplicationRow.propTypes = {
  application: PropTypes.instanceOf(Application).isRequired,
  visualizer: PropTypes.instanceOf(Visualizer).isRequired,
  deleteApplication: PropTypes.func.isRequired,
  dialogOpen: PropTypes.func.isRequired
};

export default withDialogControls(makePureRender(ApplicationRow));
