import React, { PropTypes } from 'react'
import { List } from 'immutable'
import Table from 'material-ui/Table/Table';
import TableHeader from 'material-ui/Table/TableHeader';
import TableHeaderColumn from 'material-ui/Table/TableHeaderColumn';
import TableBody from 'material-ui/Table/TableBody';
import TableRow from 'material-ui/Table/TableRow';
import VisualizerRow from './VisualizerRow'

const VisualizersTable = ({ visualizers, editVisualizer, deleteVisualizer }) => (
  <Table selectable={false}>
    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
      <TableRow>
        <TableHeaderColumn style={{ width: '5%' }}> </TableHeaderColumn>
        <TableHeaderColumn style={{ width: '40%' }}>Title</TableHeaderColumn>
        <TableHeaderColumn>Name</TableHeaderColumn>
        <TableHeaderColumn>Enabled</TableHeaderColumn>
        <TableHeaderColumn style={{ width: '10%' }}> </TableHeaderColumn>
      </TableRow>
    </TableHeader>
    <TableBody displayRowCheckbox={false} allowMultiselect showRowHover>
      {visualizers.map(visualizer =>
        <VisualizerRow
          key={visualizer.id}
          visualizer={visualizer}
          editVisualizer={() => editVisualizer(visualizer.id)}
          deleteVisualizer={() => deleteVisualizer(visualizer.id)}
        />
      )}
    </TableBody>
  </Table>
);

VisualizersTable.propTypes = {
  visualizers: PropTypes.instanceOf(List).isRequired,
  editVisualizer: PropTypes.func.isRequired,
  deleteVisualizer: PropTypes.func.isRequired
};

export default VisualizersTable;
