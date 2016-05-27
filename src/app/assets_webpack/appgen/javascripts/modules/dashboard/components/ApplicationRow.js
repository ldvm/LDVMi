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

const ApplicationRow = ({ application, visualizer }) => (
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
      <IconMenu
         iconButtonElement={<IconButton icon="more_vert" />}
         anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
         targetOrigin={{horizontal: 'right', vertical: 'top'}}
       >
        <Link to={configuratorRoutes.applicationUrl(application.id)}>
          <MenuItem primaryText="Configure" icon="mode_edit" />
        </Link>
        <a href={applicationRoutes.applicationUrl(application)} target="_blank">
          {application.published ?
            <MenuItem primaryText="Open" icon="open_in_browser" /> :
            <MenuItem primaryText="Preview" icon="find_in_page" />}
        </a>
        <MenuItem primaryText="Delete" icon="delete" />
      </IconMenu>
    </TableRowColumn>
  </TableRow>
);

ApplicationRow.propTypes = {
  application: PropTypes.instanceOf(Application).isRequired,
  visualizer: PropTypes.instanceOf(Visualizer).isRequired
};

export default makePureRender(ApplicationRow);
