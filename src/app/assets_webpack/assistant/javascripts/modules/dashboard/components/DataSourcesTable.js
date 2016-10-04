import React, { PropTypes } from 'react'
import { List } from 'immutable'
import Table from 'material-ui/Table/Table';
import TableHeader from 'material-ui/Table/TableHeader';
import TableHeaderColumn from 'material-ui/Table/TableHeaderColumn';
import TableBody from 'material-ui/Table/TableBody';
import TableRow from 'material-ui/Table/TableRow';
import DataSourceRow from './DataSourceRow'

const DataSourcesTable = ({ dataSources, editDataSource, deleteDataSource }) => (
  <Table selectable={false}>
    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
      <TableRow>
        <TableHeaderColumn style={{ width: '60%' }}>Name</TableHeaderColumn>
        <TableHeaderColumn>Public</TableHeaderColumn>
        <TableHeaderColumn style={{ width: '10%' }}> </TableHeaderColumn>
      </TableRow>
    </TableHeader>
    <TableBody displayRowCheckbox={false} allowMultiselect showRowHover>
      {dataSources.map(dataSource =>
        <DataSourceRow
          key={dataSource.id}
          dataSource={dataSource}
          editDataSource={() => editDataSource(dataSource.id)}
          deleteDataSource={() => deleteDataSource(dataSource.id)}
        />
      )}
    </TableBody>
  </Table>
);

DataSourcesTable.propTypes = {
  dataSources: PropTypes.instanceOf(List).isRequired,
  editDataSource: PropTypes.func.isRequired,
  deleteDataSource: PropTypes.func.isRequired
};

export default DataSourcesTable;
