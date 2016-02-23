import React, { PropTypes } from 'react'
import { connect } from 'redux'
import { List } from 'immutable';
import { dialogClose } from '../../../ducks/dialog'
import Button from '../../../misc/components/Button'
import IconButton from '../../../misc/components/IconButton'
import Dialog from '../../../containers/Dialog';

import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';

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
          {pipelines.map(pipeline => Pipeline(pipeline, runEvaluation) )}
        </TableBody>
      </Table>
    </Dialog>
  );
};

const Pipeline = (pipeline, runEvaluation) => {
  const lastEvaluation = pipeline.evaluations.get(0);

  let statusIcon = '';
  if (lastEvaluation != null) {
    statusIcon = lastEvaluation.isFinished ?
      (lastEvaluation.isSuccess ? 'done' : 'error') : 'hourglass_empty'
  }

  return <TableRow selected key={pipeline.id}>
      <TableRowColumn>{pipeline.title}</TableRowColumn>
      <TableRowColumn width={100}>
        {lastEvaluation != null && <IconButton icon={statusIcon} />}
      </TableRowColumn>
      <TableRowColumn width={400}>
        <Button warning raised icon="play_arrow" label="Run pipeline"
          onTouchTap={() => runEvaluation(pipeline.id)}
        />
        <Button raised icon="pageview" label="Preview"
          disabled={!(lastEvaluation != null && lastEvaluation.isFinished && lastEvaluation.isSuccess)}
        />
        <Button success raised icon="create" label="Create app"
          disabled={!(lastEvaluation != null && lastEvaluation.isFinished && lastEvaluation.isSuccess)}
        />
      </TableRowColumn>
    </TableRow>
};

ShowPipelinesDialog.dialogName = dialogName;

ShowPipelinesDialog.propTypes = {
  dialogInstanceName: PropTypes.string.isRequired,
  pipelines: PropTypes.instanceOf(List).isRequired,
  dialogClose: PropTypes.func.isRequired,
  runEvaluation: PropTypes.func.isRequired
};

export default ShowPipelinesDialog;
