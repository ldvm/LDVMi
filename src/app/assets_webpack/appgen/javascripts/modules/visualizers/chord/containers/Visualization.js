import React, { Component, PropTypes } from 'react'
import { OrderedSet } from 'immutable'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import CenteredMessage from '../../../../components/CenteredMessage'
import D3ChordContainer from './D3ChordContainer'
import { visualizeSelectedNodes, visualizedNodesSelector } from '../ducks/visualizedNodes'

class Visualization extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    nodeUris: PropTypes.instanceOf(OrderedSet).isRequired
  };

  componentWillMount() {
    // Let's load the selected nodes when this component mounts for the first time
    // (probably when the application is initialized)
    const { dispatch } = this.props;
    dispatch(visualizeSelectedNodes());
  }

  render() {
    const { nodeUris } = this.props;

    if (nodeUris.size == 0) {
      return <CenteredMessage>No graph data selected for visualization.</CenteredMessage>
    }

    return <D3ChordContainer nodeUris={nodeUris} />
  }
}

const selector = createStructuredSelector({
  nodeUris: visualizedNodesSelector
});

export default connect(selector)(Visualization)
