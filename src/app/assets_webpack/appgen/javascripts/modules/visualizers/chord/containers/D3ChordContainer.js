import React, { Component, PropTypes } from 'react'
import { createSelector, createStructuredSelector } from 'reselect'
import { OrderedSet, is } from 'immutable'
import { connect } from 'react-redux'
import D3Chord from '../components/D3Chord'
import { getMatrix, matrixSelector, matrixStatusSelector } from '../ducks/matrix'
import { PromiseStatus } from '../../../core/models'
import PromiseResult from '../../../core/components/PromiseResult'
import CenteredMessage from '../../../../components/CenteredMessage'
import loadNodes from './loadNodes'
import { createAggregatedPromiseStatusSelector } from '../../../core/ducks/promises'
import { langSelector } from '../../../core/ducks/lang'
import { extractLocalizedValue } from '../../../core/misc/languageUtils'
import { customLabelsSelector } from '../../../manageApp/ducks/customLabels'
import { applyCustomLabel } from '../../../manageApp/misc/customLabelsUtils'
import VisualizationMessage from '../components/VisualizationMessage'
import { graphSelector } from '../ducks/graph'
import { publishSettingsSelector } from '../ducks/publishSettings'
import { Graph, PublishSettings } from '../models'

class D3ChordContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    matrix: PropTypes.array.isRequired,
    nodes: PropTypes.array.isRequired,
    nodeUris: PropTypes.instanceOf(OrderedSet),
    graph: PropTypes.instanceOf(Graph),
    publishSettings: PropTypes.instanceOf(PublishSettings),
    status: PropTypes.instanceOf(PromiseStatus).isRequired
  };

  componentWillMount() {
    this.loadMatrix(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (!is(this.props.nodeUris, nextProps.nodeUris)) {
      this.loadMatrix(nextProps)
    }
  }

  loadMatrix(props) {
    const { dispatch, nodeUris } = props;
    dispatch(getMatrix(nodeUris.toJS()));
  }

  isMatrixEmpty(matrix) {
    if (!matrix || !matrix.length || !matrix.reduce) {
      return false;
    }

    const sum = matrix.reduce(
      (sum, row) => sum + row.reduce(
        (sum, current) => sum + current, 0)
      , 0);
    return sum == 0;
  }

  render() {
    const { matrix, nodes, graph, publishSettings, status } = this.props;

    if (!status.done) {
      return <VisualizationMessage>
          <PromiseResult status={status} loadingMessage="Loading graph data for selected nodes..." />
        </VisualizationMessage>
    }

    if (this.isMatrixEmpty(matrix)) {
      return <VisualizationMessage>
          <CenteredMessage>The graph is empty. There is nothing to visualize.</CenteredMessage>
        </VisualizationMessage>
    }

    return <D3Chord
      matrix={matrix}
      nodes={nodes}
      directed={graph.directed}
      displayAsUndirected={publishSettings.displayAsUndirected}
    />;
  }
}

// Both injected by NodeLoader
const nodesSelector = (status, props) => props.nodes;
const nodeStatusSelector = (status, props) => props.status;

const convertedNodesSelector = createSelector(
  [langSelector, nodesSelector, customLabelsSelector],
  (lang, nodes, customLabels) => {
    // We need to extract labels in correct language and also apply custom labels if
    // available for D3.js
    return nodes.map(({ uri, label, inDegree, outDegree }) => ({
      uri,
      label: extractLocalizedValue(lang, applyCustomLabel(uri, label, customLabels), 'missing label'),
      inDegree, outDegree
    })).toJS()
  }
);

const selector = createStructuredSelector({
  nodes: convertedNodesSelector,
  matrix: matrixSelector,
  graph: graphSelector,
  publishSettings: publishSettingsSelector,

  // We make the component wait until both the matrix and nodes are properly loaded from the
  // server before we start to render the D3.js visualization
  status: createAggregatedPromiseStatusSelector([matrixStatusSelector, nodeStatusSelector])
});

export default loadNodes(connect(selector)(D3ChordContainer));
