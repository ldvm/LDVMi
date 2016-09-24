import React, { Component, PropTypes } from 'react'
import { OrderedSet, is } from 'immutable'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { getNodes, nodesSelector, createNodesStatusSelector } from '../ducks/nodes'
import { PromiseStatus } from '../../../core/models'
import makePureRender from '../../../../misc/makePureRender'

/**
 * A higher-order component that loads required nodes from the backend. The required nodes are
 * passed as an array of uris. Using the following selector, the nodes already available in the
 * store are passed down to the wrapped component and the rest (the missing nodes) is requested
 * from the backend.
 *
 * The mechanism is fairly simple and doesn't try to avoid redundancies. It is therefore possible
 * that some nodes will be loaded more then once.
 */
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
      // Even though the component is "pure render", we better deeply compare the missing node
      // uris to avoid unnecessary requests.
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

  const nodeUrisSelector = (_, props) => props.nodeUris; // Should be Immutable.OrderedSet

  const missingNodeUrisSelector = createSelector(
    [nodesSelector, nodeUrisSelector],
    (nodes, nodeUris) => nodeUris.filter(uri => !nodes.has(uri))
  );

  // Get the status of the current request fetching the missing nodes. The promise status is
  // identified with missing nodes being fetched. So we have to pass the missing nodes to the
  // status selector.
  const nodesStatusSelector = createNodesStatusSelector((state, props) =>
    missingNodeUrisSelector(state, props).toJS());

  const selector = createSelector(
    [nodesSelector, nodesStatusSelector, nodeUrisSelector, missingNodeUrisSelector],
    (nodes, status, nodeUris, missingNodeUris) => {
      const selectedNodes = nodeUris
        .map(uri => nodes.get(uri))
        .filter(node => node != null);
      const completed = missingNodeUris.size === 0;

      let finalStatus;
      if (completed) {
        finalStatus = new PromiseStatus({ isLoading: false, done: true });
      } else {
        finalStatus = status;
      }

      console.log(status.toJS());

      return {
        nodes: selectedNodes,
        missingNodeUris: missingNodeUris,
        status: finalStatus
      }
    }
  );

  // "Pure render sandwich". We want to avoid unnecessary updates from both sides.
  return makePureRender(connect(selector)(makePureRender(NodeLoader)));
}
