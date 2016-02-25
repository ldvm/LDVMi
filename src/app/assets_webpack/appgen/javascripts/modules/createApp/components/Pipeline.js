import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import Button from '../../../misc/components/Button'
import IconButton from '../../../misc/components/IconButton'
import Dialog from '../../../containers/Dialog';

import TableRow from 'material-ui/lib/table/table-row';
import TableRowColumn from 'material-ui/lib/table/table-row-column';

import { PipelineWithEvaluations } from '../models'
import { createStatusSelector } from '../ducks/runEvaluationStatus'
import { PromiseStatus } from '../../../ducks/promises'

const Pipeline = ({pipeline, runEvaluation, runEvaluationStatus}) => {
  const lastEvaluation = pipeline.evaluations.get(0);

  let statusIcon = '';
  if (lastEvaluation != null) {
    statusIcon = lastEvaluation.isFinished ?
      (lastEvaluation.isSuccess ? 'done' : 'error') : 'hourglass_empty'
  }

  return <TableRow key={pipeline.id}>
    <TableRowColumn>{pipeline.title}</TableRowColumn>
    <TableRowColumn width={100}>
      {lastEvaluation != null && <IconButton icon={statusIcon} />}
    </TableRowColumn>
    <TableRowColumn width={400}>
      <Button warning raised icon="play_arrow" label="Run pipeline"
        disabled={runEvaluationStatus.isLoading}
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

Pipeline.propTypes = {
  pipeline: PropTypes.instanceOf(PipelineWithEvaluations).isRequired,
  runEvaluation: PropTypes.func.isRequired,
  runEvaluationStatus: PropTypes.instanceOf(PromiseStatus).isRequired
};

export default connect((status, props) => ({
  runEvaluationStatus: createStatusSelector(() => props.pipeline.id)(status)
}))(Pipeline);
