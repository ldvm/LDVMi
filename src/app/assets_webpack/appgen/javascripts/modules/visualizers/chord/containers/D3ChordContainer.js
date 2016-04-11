import React, { Component, PropTypes } from 'react'
import { createStructuredSelector } from 'reselect'
import { List, is } from 'immutable'
import { connect } from 'react-redux'
import D3Chord from '../components/D3Chord'
import { getMatrix, matrixSelector, matrixStatusSelector } from '../ducks/matrix'
import { PromiseStatus } from '../../../core/models'
import PromiseResult from '../../../core/components/PromiseResult'
import CenteredMessage from '../../../../components/CenteredMessage'
import { applicationSelector } from "../../../manageApp/ducks/application";
import { Application } from "../../../manageApp/models";

class D3ChordContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    application: PropTypes.instanceOf(Application).isRequired,
    matrix: PropTypes.array.isRequired,
    status: PropTypes.instanceOf(PromiseStatus).isRequired,
    nodeUris: PropTypes.instanceOf(List)
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
    const { dispatch, application, nodeUris } = props;
    dispatch(getMatrix(application.id, nodeUris.toJS()));
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
    const { matrix, status } = this.props;

    // TODO: Hiding the visualization is probably not the best idea.
    if (!status.done) {
      return <PromiseResult status={status} loadingMessage="Loading graph data for selected nodes..." />
    }

    if (this.isMatrixEmpty(matrix)) {
      return <CenteredMessage>The graph is empty. There is nothing to visualize.</CenteredMessage>
    }

    return <D3Chord matrix={matrix} />;
  }
}

const selector = createStructuredSelector({
  application: applicationSelector,
  matrix: matrixSelector,
  status: matrixStatusSelector
});

// TODO: nodes loading based on uris (+ status, use higher order component)
export default connect(selector)(D3ChordContainer);
