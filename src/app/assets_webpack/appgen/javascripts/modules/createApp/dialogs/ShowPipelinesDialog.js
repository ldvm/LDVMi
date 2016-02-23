import React, { PropTypes } from 'react'
import { connect } from 'redux'
import { List } from 'immutable';
import { dialogClose } from '../../../ducks/dialog'
import Button from '../../../misc/components/Button'
import Dialog from '../../../containers/Dialog';

import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';

export const dialogName = 'SHOW_PIPELINES_DIALOG';

const ShowPipelinesDialog = (props) =>  {
  const {dialogClose, pipelines, dialogInstanceName} = props;

  const actions = [
    <Button label="Close" onTouchTap={() => dialogClose(dialogInstanceName)} />
  ];

  return (
    <Dialog name={dialogInstanceName} title="Select pipeline" actions={actions} modal={false}>
      <Table selectable={false}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Run</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false} allowMultiselect>
          {pipelines.map(pipeline =>
            <TableRow selected key={pipeline.id}>
              <TableRowColumn>{pipeline.title}</TableRowColumn>
              <TableRowColumn>
                <Button warning raised icon="play_arrow" label="Run pipeline" />
              </TableRowColumn>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Dialog>
  );
};

ShowPipelinesDialog.dialogName = dialogName;

ShowPipelinesDialog.propTypes = {
  dialogInstanceName: PropTypes.string.isRequired,
  pipelines: PropTypes.instanceOf(List).isRequired,
  dialogClose: PropTypes.func.isRequired
};

export default ShowPipelinesDialog;
