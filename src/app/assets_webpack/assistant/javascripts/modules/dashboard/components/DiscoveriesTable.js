import React, { PropTypes } from 'react'
import { List } from 'immutable'
import Table from 'material-ui/Table/Table';
import TableHeader from 'material-ui/Table/TableHeader';
import TableHeaderColumn from 'material-ui/Table/TableHeaderColumn';
import TableBody from 'material-ui/Table/TableBody';
import TableRow from 'material-ui/Table/TableRow';
import DiscoveryRow from './DiscoveryRow'

const DiscoveriesTable = ({ discoveries, deleteDiscovery }) => (
  <Table selectable={false}>
    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
      <TableRow>
        <TableHeaderColumn style={{ width: '50%' }}>Discovery</TableHeaderColumn>
        <TableHeaderColumn>Status</TableHeaderColumn>
        <TableHeaderColumn>Discovered pipelines</TableHeaderColumn>
        <TableHeaderColumn>Finished/last updated</TableHeaderColumn>
        <TableHeaderColumn style={{ width: '10%' }}> </TableHeaderColumn>
      </TableRow>
    </TableHeader>
    <TableBody displayRowCheckbox={false} showRowHover>
      {discoveries.map(discovery =>
        <DiscoveryRow
          key={discovery.id}
          discovery={discovery}
          deleteDiscovery={() => deleteDiscovery(discovery.id)}
        />
      )}
    </TableBody>
  </Table>
);

DiscoveriesTable.propTypes = {
  discoveries: PropTypes.instanceOf(List).isRequired,
  deleteDiscovery: PropTypes.func.isRequired
};

export default DiscoveriesTable;
