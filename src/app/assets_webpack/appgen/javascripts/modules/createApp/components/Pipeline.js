import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { routeActions } from 'redux-simple-router'
import Button from '../../../misc/components/Button'
import IconButton from '../../../misc/components/IconButton'
import TableRow from 'material-ui/lib/table/table-row';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import { dialogOpen, dialogClose } from '../../../ducks/dialog'
import { PipelineWithEvaluations } from '../models'
import { createStatusSelector } from '../ducks/runEvaluationStatus'
import { PromiseStatus } from '../../../ducks/promises'
import CreateAppDialog from '../dialogs/CreateAppDialog'
import { notification } from '../../../actions/notification'
import * as api from '../api'

const Pipeline = ({pipeline, runEvaluation, runEvaluationStatus, dispatch}) => {
  const lastEvaluation = pipeline.evaluations.get(0);
  const createAppDialogName = 'CREATE_APP_DIALOG_' + pipeline.id;

  let statusIcon = '';
  if (lastEvaluation != null) {
    statusIcon = lastEvaluation.isFinished ?
      (lastEvaluation.isSuccess ? 'done' : 'error') : 'hourglass_empty'
  }

  const isRunning = runEvaluationStatus.isLoading || (lastEvaluation != null && !lastEvaluation.isFinished);
  const isFinished = lastEvaluation != null && lastEvaluation.isFinished && lastEvaluation.isSuccess;

  const handleCreateApp = async (data) => {
    try {
      const appId = await api.createApp(data.name, pipeline.id);
      dispatch(notification(`New data application (${appId}) has been created`));
      dispatch(routeActions.push('/manage-app/' + appId));
    }
    catch (e) {
      console.log(e);
      dispatch(notification(e.message));
    }
  };

  return <TableRow key={pipeline.id}>
    <TableRowColumn>{pipeline.title}</TableRowColumn>
    <TableRowColumn width={100}>
      {lastEvaluation != null && <IconButton icon={statusIcon} />}
    </TableRowColumn>
    <TableRowColumn width={400}>
      <Button warning raised icon="play_arrow"
        label={isRunning ? 'Running...' : 'Run pipeline'}
        disabled={isRunning}
        onTouchTap={() => runEvaluation(pipeline.id)}
      />
      <Button raised icon="pageview" label="Preview"
        disabled={!isFinished}
      />
      <Button success raised icon="create" label="Create app"
        disabled={!isFinished}
        onTouchTap={() => dispatch(dialogOpen(createAppDialogName))}
      />

      <CreateAppDialog
        onSubmit={handleCreateApp}
        dialogName={createAppDialogName}
        dialogClose={(name) => dispatch(dialogClose(name))}
      />
    </TableRowColumn>
  </TableRow>
};

Pipeline.propTypes = {
  pipeline: PropTypes.instanceOf(PipelineWithEvaluations).isRequired,
  runEvaluation: PropTypes.func.isRequired,
  runEvaluationStatus: PropTypes.instanceOf(PromiseStatus).isRequired
};

export default connect((status, props) => ({
  runEvaluationStatus: createStatusSelector(() => props.pipeline.id)(status)
}))(Pipeline);
