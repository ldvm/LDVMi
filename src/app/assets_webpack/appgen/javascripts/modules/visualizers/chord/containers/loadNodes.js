import React, { Component, PropTypes } from 'react'
import { List, Set, is } from 'immutable'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { getNodes, nodesSelector, nodesStatusSelector } from '../ducks/nodes'
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

const nodeUrisSelector = (state, props) => new List(props.nodeUris);

const selector = createSelector(
  [nodesSelector, nodesStatusSelector, nodeUrisSelector],
  (nodes, status, nodeUris) => {
    const selectedNodes = nodeUris
      .map(uri => nodes.get(uri))
      .filter(node => node != null)
      .toList();
    const missingNodeUris = new Set(nodeUris
      .filter(uri => !nodes.has(uri)));
    const completed = missingNodeUris.size === 0;

    // For simplicity, the injected status is aggregated for all GET_NODES requests. Therefore
    // it is not possible to determine what is the status of the requests invoked by this
    // component instance.

    let finalStatus;
    if (completed) {
      finalStatus = new PromiseStatus({isLoading: false, done: true});
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
      nodeUris: PropTypes.instanceOf(Set).isRequired,
      nodes: PropTypes.instanceOf(List).isRequired,
      missingNodeUris: PropTypes.instanceOf(Set).isRequired,
      status: PropTypes.instanceOf(PromiseStatus).isRequired
    };

    componentDidMount() {
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
