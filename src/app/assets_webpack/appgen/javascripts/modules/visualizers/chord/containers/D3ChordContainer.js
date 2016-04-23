import React, { Component, PropTypes } from 'react'
import { createStructuredSelector } from 'reselect'
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
import { extractLocalizedValue } from '../../../core/containers/LocalizedValue'

class D3ChordContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    matrix: PropTypes.array.isRequired,
    nodeUris: PropTypes.instanceOf(OrderedSet),
    nodes: PropTypes.instanceOf(OrderedSet),
    status: PropTypes.instanceOf(PromiseStatus).isRequired
  };

  // TODO: implement shouldComponentUpdate to check for matrix and nodeUris

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

  convertNodes(nodes, lang) {
    // We need to extract labels in correct language for D3.js
    return nodes.map(({ uri, label, inDegree, outDegree }) => ({
      uri,
      label: extractLocalizedValue(lang, label, 'missing label'),
      inDegree, outDegree
    })).toJS()
  }

  render() {
    const { lang, matrix, nodes, status } = this.props;

    // TODO: Hiding the visualization is probably not the best idea.
    if (!status.done) {
      return <PromiseResult status={status} loadingMessage="Loading graph data for selected nodes..." />
    }

    if (this.isMatrixEmpty(matrix)) {
      return <CenteredMessage>The graph is empty. There is nothing to visualize.</CenteredMessage>
    }

    return <D3Chord matrix={matrix} nodes={this.convertNodes(nodes, lang)} />;
  }
}

const nodeStatusSelector = (status, props) => props.status; // Injected by NodeLoader

const selector = createStructuredSelector({
  lang: langSelector,
  matrix: matrixSelector,

  // We make the component wait until both the matrix and nodes are properly loaded from the
  // server before we start to render the D3.js visualization
  status: createAggregatedPromiseStatusSelector([matrixStatusSelector, nodeStatusSelector])
});

export default loadNodes(connect(selector)(D3ChordContainer));
