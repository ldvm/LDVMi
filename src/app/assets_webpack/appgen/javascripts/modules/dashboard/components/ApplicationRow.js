import React, { PropTypes } from 'react'
import TableRow from 'material-ui/lib/table/table-row'
import TableRowColumn from 'material-ui/lib/table/table-row-column'
import { Link } from 'react-router'
import Icon from '../../../components/Icon'
import Button from '../../../components/Button'
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
  marginBottom: '12px'
};

const ApplicationRow = ({ application, visualizer }) => (
  <TableRow>
    <TableRowColumn style={{ width: '50%' }}>
      <h3 style={h3Style}>
        {visualizer &&
          <Icon icon={visualizer.icon} style={iconStyle} color="#333333" />
        }
        <Link style={linkStyle} to={configuratorRoutes.applicationUrl(application.id)}>
          {application.name}
        </Link>
      </h3>
      <div style={descriptionStyle}>{application.description}</div>
    </TableRowColumn>
    <TableRowColumn style={{ width: '10%' }}>
      {application.published && <Icon icon="done" color={theme.success} />}
    </TableRowColumn>
    <TableRowColumn>
      <Link to={configuratorRoutes.applicationUrl(application.id)}>
        <Button label="Configure" icon="mode_edit" />
      </Link>
    </TableRowColumn>
    <TableRowColumn>
      {application.published ?
        <a href={applicationRoutes.applicationUrl(application)} target="_blank">
          <Button label="Open" icon="open_in_browser" />
        </a> :
        <a href={applicationRoutes.applicationUrl(application)} target="_blank">
          <Button label="Preview" icon="find_in_page" />
        </a>
      }
    </TableRowColumn>
    <TableRowColumn>
      <Button icon="delete" label="Delete " danger />
    </TableRowColumn>
  </TableRow>
);

ApplicationRow.propTypes = {
  application: PropTypes.instanceOf(Application).isRequired,
  visualizer: PropTypes.instanceOf(Visualizer).isRequired
};

export default makePureRender(ApplicationRow);
