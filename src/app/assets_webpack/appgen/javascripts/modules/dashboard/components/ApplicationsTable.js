import React, { PropTypes } from 'react'
import { List } from 'immutable'
import Table from 'material-ui/lib/table/table'
import TableHeader from 'material-ui/lib/table/table-header'
import TableHeaderColumn from 'material-ui/lib/table/table-header-column'
import TableBody from 'material-ui/lib/table/table-body'
import TableRow from 'material-ui/lib/table/table-row'
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
