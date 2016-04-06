import React, { Component, PropTypes } from 'react'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { Application } from '../../../manageApp/models'
import { Visualizer } from '../../../core/models'
import { graphSelector, graphStatusSelector } from '../ducks/graph'
import { Graph } from '../models'
import { PromiseStatus } from '../../../core/models'
import PromiseResult from '../../../core/components/PromiseResult'

class Configurator extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    application: PropTypes.instanceOf(Application).isRequired,
    visualizer: PropTypes.instanceOf(Visualizer).isRequired,
    graph: PropTypes.instanceOf(Graph).isRequired,
    graphStatus: PropTypes.instanceOf(PromiseStatus).isRequired
  };


  componentWillMount() {
    const { dispatch, application } = this.props;
  }

  render() {
    const { application, visualizer, graph, graphStatus } = this.props;

    if (!graphStatus.done) {
      return <PromiseResult status={graphStatus} />
    }

    return <div>
      {application.name} <br />
      {visualizer.title} <br />
      Node count: {graph.nodeCount}
      Edge count: {graph.edgeCount}
    </div>;
  }
}

const selector = createStructuredSelector({
  graph: graphSelector,
  graphStatus: graphStatusSelector
});

export default connect(selector)(Configurator);
