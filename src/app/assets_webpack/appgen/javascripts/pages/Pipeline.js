import React, { Component } from 'react'
import { connect } from 'react-redux'
import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';
import LinearProgress from 'material-ui/lib/linear-progress'
import RaisedButton from 'material-ui/lib/raised-button'
import PaperCard from '../misc/components/PaperCard'
import { getPipeline, getPipelineEvaluations } from '../modules/discovery/actions'

class Pipeline extends Component {
  componentDidMount() {
    const {dispatch, params: {pipelineId}} = this.props;
    dispatch(getPipeline(pipelineId));
    dispatch(getPipelineEvaluations(pipelineId));
  }

  render() {
    const { error, isLoading, pipeline, evaluations } = this.props;
    return (
      <PaperCard
        title="Pipeline detail"
        subtitle={pipeline.title}>

        {isLoading && <LinearProgress mode="indeterminate"/>}
        {error && error != "" && <p>{error}</p>}
        {evaluations.count() == 0 && 'You have to run the pipeline first to get a visualization.'}

      </PaperCard>
    )
  }
}

export default connect(state => ({
  isLoading: state.pipeline.isLoading || state.pipelineEvaluations.isLoading,
  error: state.pipeline.error || state.pipelineEvaluations.error,
  pipeline: state.pipeline.data,
  evaluations: state.pipelineEvaluations.data
}))(Pipeline);
