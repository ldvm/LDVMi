import React, { Component } from 'react'
import { connect } from 'react-redux'
import LinearProgress from '../../../../../../../node_modules/material-ui/lib/linear-progress'
import RaisedButton from '../../../../../../../node_modules/material-ui/lib/raised-button'
import PaperCard from '../../../misc/components/PaperCard'
import { routeActions } from 'redux-simple-router'
import { runDiscovery } from '../ducks/discovery'

class Discovery extends Component {
  componentDidMount() {
    const {dispatch, dataSourceTemplateIds} = this.props;
    dispatch(runDiscovery(dataSourceTemplateIds));
  }

  render() {
    const {isFinished, isSuccess, errors, messages, pipelinesDiscoveredCount, id, dispatch} = this.props;

    return (
      <PaperCard
        title="Analysis in progress"
        subtitle="Your selected data sources are being analyzed. It may take a while.">
        {isFinished ?
          <LinearProgress mode="determinate" value={100}/> :
          <LinearProgress mode="indeterminate"/>}
        <p>
          Discovered pipelines: <strong>{pipelinesDiscoveredCount}</strong>
        </p>
        <pre>
          {messages.map(message => message + '\n')}
        </pre>
        <pre>
          {errors.map(error=> error + '\n')}
        </pre>
        {isFinished && isSuccess &&
          <RaisedButton label={"Show discovered pipelines (id: " + id + ")"} primary={true}
            onTouchTap={() => dispatch(routeActions.push('/discovery/pipelines/' + id))} />
        }
      </PaperCard>
    )
  }
}

export default connect(state => {
  const ids = state.routing.location.query.dataSourceTemplateIds || [];
  return {
    dataSourceTemplateIds: Array.isArray(ids) ? ids : [ids],
    ...state.discovery.discovery.toJS()
  };
})(Discovery);
