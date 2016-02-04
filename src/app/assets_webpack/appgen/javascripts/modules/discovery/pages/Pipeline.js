import React, { Component } from 'react'
import { routeActions } from 'redux-simple-router'
import { connect } from 'react-redux'
import Table from '../../../../../../../node_modules/material-ui/lib/table/table';
import TableHeaderColumn from '../../../../../../../node_modules/material-ui/lib/table/table-header-column';
import TableRow from '../../../../../../../node_modules/material-ui/lib/table/table-row';
import TableHeader from '../../../../../../../node_modules/material-ui/lib/table/table-header';
import TableRowColumn from '../../../../../../../node_modules/material-ui/lib/table/table-row-column';
import TableBody from '../../../../../../../node_modules/material-ui/lib/table/table-body';
import LinearProgress from '../../../../../../../node_modules/material-ui/lib/linear-progress'
import RaisedButton from '../../../../../../../node_modules/material-ui/lib/raised-button'
import PaperCard from '../../../misc/components/PaperCard'

const Pipeline = (props) => {
  const { error, isLoading, pipeline, evaluations, params: {pipelineId}, dispatch } = props;
  return (
    <PaperCard title="Pipeline detail" subtitle={pipeline.title}>
      {isLoading && <LinearProgress mode="indeterminate"/>}

      <div>
        <RaisedButton label={"Run evaluation"} primary={true}
          onTouchTap={() => dispatch(routeActions.push('/discovery/evaluation/' + pipelineId))} />
      </div>


      {error && error != "" && <p>{error}</p>}
      {evaluations.count() == 0 && <p>You have to run the pipeline first to get a visualization.</p>}
    </PaperCard>
  )
};

export default connect(state => ({
  isLoading: state.discovery.pipeline.isLoading || state.discovery.evaluations.isLoading,
  error: state.discovery.pipeline.error || state.discovery.evaluations.error,
  pipeline: state.discovery.pipeline.data,
  evaluations: state.discovery.evaluations.data
}))(Pipeline);
