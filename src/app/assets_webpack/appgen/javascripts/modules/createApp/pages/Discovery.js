import React, { Component, PropTypes } from 'react'
import { List } from 'immutable'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { getDiscovery, getDiscoveryReset, discoverySelector } from '../ducks/discovery'
import { getEvaluations, getEvaluationsReset } from '../ducks/evaluations'
import { dialogOpen, dialogClose } from '../../core/ducks/dialog'
import { runEvaluation } from '../ducks/runEvaluationStatus'
import PromiseResult from '../../core/components/PromiseResult'
import CenteredMessage from '../../../components/CenteredMessage'
import DiscoveryStatus from '../components/DiscoveryStatus'
import Visualizers from '../components/Visualizers'
import ShowPipelinesDialog, { dialogName as showPipelinesDialogName } from '../dialogs/ShowPipelinesDialog'
import { selectVisualizer } from '../ducks/selectedVisualizer'
import { PromiseStatus, VisualizerWithPipelines } from '../../core/models'
import { Discovery as DiscoveryModel } from '../models'

class Discovery extends Component {
  static propTypes = {
    status: PropTypes.instanceOf(PromiseStatus).isRequired,
    discovery: PropTypes.instanceOf(DiscoveryModel),
    pipelines: PropTypes.instanceOf(List).isRequired,
    unsupportedPipelines: PropTypes.instanceOf(List).isRequired,
    visualizers: PropTypes.instanceOf(List).isRequired,
    evaluations: PropTypes.instanceOf(List).isRequired,
    selectedVisualizer: PropTypes.instanceOf(VisualizerWithPipelines).isRequired
  };

  componentWillMount() {
    this.getDiscovery();
    this.getEvaluations();
  }

  componentWillUnmount() {
    clearTimeout(this.discoveryTimeout);
    clearTimeout(this.evaluationsTimeout);

    const { dispatch } = this.props;
    dispatch(getDiscoveryReset());
    dispatch(getEvaluationsReset());
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

  showPipelines(visualizer) {
    const { dispatch } = this.props;
    dispatch(selectVisualizer(visualizer.id));
    dispatch(dialogOpen(showPipelinesDialogName));
  }

  render() {
    const { dispatch, unsupportedPipelines, status, discovery, visualizers, selectedVisualizer } = this.props;

    return (
      <div>
        {!discovery && <div>
          <Helmet title="Loading discovery..."  />
          <PromiseResult status={status} />
        </div>}

        {discovery && <div>
          <Helmet title={"Discovery of " + discovery.name} />
          <DiscoveryStatus
            discovery={discovery}
            unsupportedPipelinesCount={unsupportedPipelines.size}
          />

          {visualizers.size > 0 ?
            <Visualizers
              visualizers={visualizers}
              showPipelines={::this.showPipelines}
            /> :
            <CenteredMessage>
              No pipelines found {discovery.isFinished ? '.' : ' (yet).'}
            </CenteredMessage>
          }

          <ShowPipelinesDialog
            pipelines={selectedVisualizer.pipelines}
            dialogClose={name => dispatch(dialogClose(name))}
            runEvaluation={pipelineId => dispatch(runEvaluation(discovery.id, pipelineId))}
          />
        </div>}
      </div>
    );
  }
}

export default connect(discoverySelector)(Discovery);
