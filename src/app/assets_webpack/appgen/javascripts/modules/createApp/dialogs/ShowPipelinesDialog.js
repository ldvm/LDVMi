import React, { PropTypes } from 'react'
import { List } from 'immutable';
import { dialogClose } from '../../core/ducks/dialog'
import Button from '../../../components/Button'
import IconButton from '../../../components/IconButton'
import Dialog from '../../core/containers/Dialog';

import Table from 'material-ui/lib/table/table';
import TableHeader from 'material-ui/lib/table/table-header';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableBody from 'material-ui/lib/table/table-body';
import TableRow from 'material-ui/lib/table/table-row';

import Pipeline from '../components/Pipeline'

const dialogStyle = {
  width: '1000px',
  maxWidth: '1000px'
};

export const dialogName = 'SHOW_PIPELINES_DIALOG';

const ShowPipelinesDialog = (props) =>  {
  const {dialogClose, runEvaluation, pipelines, dialogInstanceName} = props;

  const actions = [
    <Button label="Close" onTouchTap={() => dialogClose(dialogInstanceName)} />
  ];

  return (
    <Dialog name={dialogInstanceName} title="Select pipeline" actions={actions} modal={false} contentStyle={dialogStyle}>
      <Table selectable={false}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn width={100}>Status</TableHeaderColumn>
            <TableHeaderColumn width={400}>Actions</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false} allowMultiselect>
          {pipelines.map(pipeline =>
            <Pipeline pipeline={pipeline} runEvaluation={runEvaluation} key={pipeline.id} />)}
        </TableBody>
      </Table>
    </Dialog>
  );
};

ShowPipelinesDialog.dialogName = dialogName;

ShowPipelinesDialog.propTypes = {
  dialogInstanceName: PropTypes.string.isRequired,
  pipelines: PropTypes.instanceOf(List).isRequired,
  dialogClose: PropTypes.func.isRequired,
  runEvaluation: PropTypes.func.isRequired
};

export default ShowPipelinesDialog;
