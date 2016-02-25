import React, { Component } from 'react'
import Helmet from "react-helmet"
import { connect } from 'react-redux'
import { getDiscovery, discoverySelector } from '../ducks/discovery'
import { getEvaluations } from '../ducks/evaluations'
import { dialogOpen, dialogClose } from '../../../ducks/dialog'
import { runEvaluation } from '../ducks/runEvaluationStatus'
import PromiseResult from '../../../misc/components/PromiseResult'
import CenteredMessage from '../../../misc/components/CenteredMessage'
import DiscoveryStatus from '../components/DiscoveryStatus'
import Visualizers from '../components/Visualizers'

class Discovery extends Component {
  componentWillMount() {
    this.getDiscovery();
    this.getEvaluations();
  }

  componentWillUnmount() {
    clearTimeout(this.discoveryTimeout);
    clearTimeout(this.evaluationsTimeout);
  }

  componentWillReceiveProps(nextProps) {
    clearTimeout(this.discoveryTimeout);
    clearTimeout(this.evaluationsTimeout);

    const isDiscoveryFinished = nextProps.discovery && nextProps.discovery.isFinished;
    if (!isDiscoveryFinished) {
      this.startPollDiscovery();
    }

    const isEvaluationFinished = nextProps.evaluations &&
        nextProps.evaluations.every(evaluation => evaluation.isFinished);
    if (!isEvaluationFinished) {
      this.startPollEvaluations();
    }
  }

  startPollDiscovery() {
    this.discoveryTimeout = setTimeout(() => this.getDiscovery(), 1000);
  }

  startPollEvaluations() {
    this.evaluationsTimeout = setTimeout(() => this.getEvaluations(), 1000);
  }

  getDiscovery() {
    const {dispatch, params: {userPipelineDiscoveryId}} = this.props;
    dispatch(getDiscovery(userPipelineDiscoveryId));
  }

  getEvaluations() {
    const {dispatch, params: {userPipelineDiscoveryId}} = this.props;
    dispatch(getEvaluations(userPipelineDiscoveryId));
  }

  render() {
    const {dispatch, isLoading, error, discovery, pipelines, visualizers} = this.props;

    return <div>
      {!discovery && <div>
        <Helmet title="Loading discovery..."  />
        <PromiseResult isLoading={isLoading} error={error} />
      </div>}
      {discovery && <div>
        <Helmet title={"Discovery of " + discovery.name} />
        <DiscoveryStatus discovery={discovery} />
        {visualizers.size > 0 ?
          <Visualizers
            visualizers={visualizers}
            dialogOpen={name => dispatch(dialogOpen(name))}
            dialogClose={name => dispatch(dialogClose(name))}
            runEvaluation={pipelineId => dispatch(runEvaluation(discovery.id, pipelineId))}
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
