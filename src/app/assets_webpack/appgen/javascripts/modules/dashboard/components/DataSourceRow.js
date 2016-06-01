import React, { PropTypes } from 'react'
import TableRow from 'material-ui/Table/TableRow';
import TableRowColumn from 'material-ui/Table/TableRowColumn';
import IconButton from '../../../components/IconButton'
import makePureRender from '../../../misc/makePureRender'
import withDialogControls from '../../core/containers/withDialogControls'
import ConfirmDialog from '../../core/containers/ConfirmDialog'
import TitleLink from './TitleLink'
import * as theme from '../../../misc/theme'
import { DataSource } from '../../createApp/models'
import Icon from '../../../components/Icon'

const confirmDialogName = id => 'DELETE_DATA_SOURCE_CONFIRM_DIALOG_' + id;

const DataSourceRow = ({ dataSource, editDataSource, deleteDataSource, dialogOpen }) => (
  <TableRow>
    <TableRowColumn style={{ width: '60%' }}>
      <TitleLink to="#" onClick={e => { e.preventDefault(); editDataSource(); }}>
        {dataSource.name}
      </TitleLink>
    </TableRowColumn>
    <TableRowColumn>
      {dataSource.isPublic && <Icon icon="done" color={theme.success} />}
    </TableRowColumn>
    <TableRowColumn style={{ width: '10%' }}>
      <ConfirmDialog danger
        dialogName={confirmDialogName(dataSource.id)}
        message={`Do you really wish to delete the data source ${dataSource.name}?`}
        action={deleteDataSource}
        icon="delete"
      />
      <IconButton
        icon="delete"
        onTouchTap={() => dialogOpen(confirmDialogName(dataSource.id))}
      />
    </TableRowColumn>
  </TableRow>
);

DataSourceRow.propTypes = {
  dataSource: PropTypes.instanceOf(DataSource).isRequired,
  editDataSource: PropTypes.func.isRequired,
  deleteDataSource: PropTypes.func.isRequired,
  dialogOpen: PropTypes.func.isRequired
};

export default withDialogControls(makePureRender(DataSourceRow));
