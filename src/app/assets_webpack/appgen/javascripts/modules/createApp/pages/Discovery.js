import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getDiscovery, discoverySelector } from '../ducks/discovery'
import { dialogOpen, dialogClose } from '../../../ducks/dialog'
import { runEvaluation } from '../ducks/runEvaluationStatus'
import PromiseResult from '../../../misc/components/PromiseResult'
import CenteredMessage from '../../../misc/components/CenteredMessage'
import DiscoveryStatus from '../components/DiscoveryStatus'
import Visualizers from '../components/Visualizers'

class Discovery extends Component {
  componentWillMount() {
    this.getDiscovery();
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  componentWillReceiveProps(nextProps) {
    clearTimeout(this.timeout);

    const isFinished = nextProps.discovery && nextProps.discovery.isFinished;
    if (!isFinished) {
      this.startPoll();
    }
  }

  startPoll() {
    this.timeout = setTimeout(() => this.getDiscovery(), 1000);
  }

  getDiscovery() {
    const {dispatch, params: {userPipelineDiscoveryId}} = this.props;
    dispatch(getDiscovery(userPipelineDiscoveryId));
  }

  render() {
    const {dispatch, isLoading, error, discovery, pipelines, visualizers} = this.props;

    return <div>
      {!discovery && <PromiseResult isLoading={isLoading} error={error} />}
      {discovery && <div>
        <DiscoveryStatus discovery={discovery} />
        {visualizers.size > 0 ?
          <Visualizers
            visualizers={visualizers}
            dialogOpen={name => dispatch(dialogOpen(name))}
            dialogClose={name => dispatch(dialogClose(name))}
            runEvaluation={pipelineId => dispatch(runEvaluation(pipelineId))}
          /> :
          <CenteredMessage>
            No pipelines found {discovery.isFinished ? '.' : ' (yet).'}
          </CenteredMessage>
        }
      </div>}
    </div>
  }
}

export default connect(discoverySelector)(Discovery);
