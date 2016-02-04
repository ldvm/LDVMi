import React, { Component } from 'react'
import { connect } from 'react-redux'
import LinearProgress from '../../../../../../../node_modules/material-ui/lib/linear-progress'
import RaisedButton from '../../../../../../../node_modules/material-ui/lib/raised-button'
import PaperCard from '../../../misc/components/PaperCard'
import { routeActions } from 'redux-simple-router'
import { runEvaluation } from '../ducks/evaluation'

class Discovery extends Component {
  componentDidMount() {
    const {dispatch, params: {pipelineId}} = this.props;
    dispatch(runEvaluation(pipelineId));
  }

  render() {
    const {isFinished, isSuccess, errors, messages,  params: {pipelineId}, dispatch} = this.props;

    return (
      <PaperCard
        title="Running the pipeline"
        subtitle="Data is being pushed through the pipeline">
        {isFinished ?
          <LinearProgress mode="determinate" value={100}/> :
          <LinearProgress mode="indeterminate"/>}
        <pre>
          {messages.map(message => message + '\n')}
        </pre>
        <pre>
          {errors.map(error=> error + '\n')}
        </pre>
        {isFinished && isSuccess &&
          <RaisedButton label={"Go back"} primary={true}
            onTouchTap={() => dispatch(routeActions.push('/discovery/pipeline/' + pipelineId))} />
        }
      </PaperCard>
    )
  }
}

export default connect(state => ({ ...state.discovery.evaluation.toJS() }))(Discovery);
