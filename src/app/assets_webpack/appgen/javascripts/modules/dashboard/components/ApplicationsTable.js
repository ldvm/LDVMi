import React, { PropTypes } from 'react'
import { List } from 'immutable'
import Table from 'material-ui/Table/Table';
import TableHeader from 'material-ui/Table/TableHeader';
import TableHeaderColumn from 'material-ui/Table/TableHeaderColumn';
import TableBody from 'material-ui/Table/TableBody';
import TableRow from 'material-ui/Table/TableRow';
import ApplicationRow from './ApplicationRow'

const ApplicationsTable = ({ applications, visualizers, deleteApplication }) => (
  <Table selectable={false}>
    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
      <TableRow>
        <TableHeaderColumn style={{ width: '60%' }}>Name</TableHeaderColumn>
        <TableHeaderColumn>Visualizer</TableHeaderColumn>
        <TableHeaderColumn style={{ width: '10%' }}>Published</TableHeaderColumn>
        <TableHeaderColumn style={{ width: '10%' }}> </TableHeaderColumn>
      </TableRow>
    </TableHeader>
    <TableBody displayRowCheckbox={false} allowMultiselect showRowHover>
      {applications.map(application =>
        <ApplicationRow
          key={application.id}
          application={application}
          visualizer={visualizers.filter(v => v.componentTemplateId == application.visualizerComponentTemplateId).get(0)}
          deleteApplication={() => deleteApplication(application.id)}
        />
      )}
    </TableBody>
  </Table>
);

ApplicationsTable.propTypes = {
  applications: PropTypes.instanceOf(List).isRequired,
  visualizers: PropTypes.instanceOf(List).isRequired,
  deleteApplication: PropTypes.func.isRequired
};

export default ApplicationsTable;
