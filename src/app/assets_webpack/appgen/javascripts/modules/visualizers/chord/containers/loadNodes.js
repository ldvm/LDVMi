import React, { Component, PropTypes } from 'react'
import { OrderedSet, is } from 'immutable'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { getNodes, nodesSelector, createNodesStatusSelector } from '../ducks/nodes'
import { PromiseStatus } from '../../../core/models'

/**
 * A higher-order component that loads required nodes from the backend. The required nodes are
 * passed as an array of uris. Using the following selector, the nodes already available in the
 * store are passed down to the wrapped component and the rest (the missing nodes) is requested
 * from the backend.
 *
 * The mechanism is fairly simple and doesn't try to avoid redundancies. It is therefore possible
 * that some nodes will be loaded more then once.
 */

const nodeUrisSelector = (_, props) => props.nodeUris; // Should be Immutable.OrderedSet
const nodesStatusSelector = createNodesStatusSelector((_, props) => props.nodeUris.toJS());

const selector = createSelector(
  [nodesSelector, nodesStatusSelector, nodeUrisSelector],
  (nodes, status, nodeUris) => {
    const selectedNodes = nodeUris
      .map(uri => nodes.get(uri))
      .filter(node => node != null);
    const missingNodeUris = nodeUris
      .filter(uri => !nodes.has(uri));
    const completed = missingNodeUris.size === 0;

    let finalStatus;
    if (completed) {
      finalStatus = new PromiseStatus({ isLoading: false, done: true });
    } else {
      finalStatus = status;
    }

    return {
      nodes: selectedNodes,
      missingNodeUris: missingNodeUris,
      status: finalStatus
    }
  }
);

export default function loadNodes(ComposedComponent) {

  class NodeLoader extends Component {
    static propTypes = {
      dispatch: PropTypes.func.isRequired,
      nodeUris: PropTypes.instanceOf(OrderedSet).isRequired,
      nodes: PropTypes.instanceOf(OrderedSet).isRequired,
      missingNodeUris: PropTypes.instanceOf(OrderedSet).isRequired,
      status: PropTypes.instanceOf(PromiseStatus).isRequired
    };

    componentWillMount() {
      this.loadNodes(this.props.missingNodeUris);
    }

    componentWillReceiveProps(nextProps) {
      if (!is(this.props.missingNodeUris, nextProps.missingNodeUris)) {
        this.loadNodes(nextProps.missingNodeUris);
      }
    }

    loadNodes(missingNodeUris) {
      const { dispatch } = this.props;
      if (missingNodeUris.size > 0)  {
        dispatch(getNodes(missingNodeUris.toJS()));
      }
    }

    render() {
      return <ComposedComponent {...this.props} />
    }
  }

  return connect(selector)(NodeLoader);
}
