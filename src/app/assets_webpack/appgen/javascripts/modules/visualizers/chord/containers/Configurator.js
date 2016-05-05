import React, { Component, PropTypes } from 'react'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { OrderedMap } from 'immutable'
import { getGraph, getGraphReset,  graphSelector, graphStatusSelector } from '../ducks/graph'
import { getSearchableLens, getSearchableLensReset, searchableLensSelector, searchableLensStatusSelector } from '../ducks/searchableLens'
import { getConfiguration, getConfigurationReset, getConfigurationStatusSelector } from '../ducks/configuration'
import { listsSelector } from '../ducks/lists'
import { Lens, Graph } from '../models'
import { PromiseStatus } from '../../../core/models'
import PromiseResult from '../../../core/components/PromiseResult'
import { createAggregatedPromiseStatusSelector } from '../../../core/ducks/promises'
import { addBodyPadding } from '../../../../components/BodyPadding'
import SampleVisualization from './SampleVisualization'
import Visualization from './Visualization'
import Layout from '../components/Layout'
import Toolbar from '../components/Toolbar'
import ConfiguratorSidebar from '../components/ConfiguratorSidebar'

class Configurator extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    graph: PropTypes.instanceOf(Graph).isRequired,
    searchableLens: PropTypes.instanceOf(Lens).isRequired,
    lists: PropTypes.instanceOf(OrderedMap),
    status: PropTypes.instanceOf(PromiseStatus).isRequired
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(getGraph());
    dispatch(getSearchableLens());
    dispatch(getConfiguration());
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(getGraphReset());
    dispatch(getSearchableLensReset());
    dispatch(getConfigurationReset());
  }

  render() {
    const { searchableLens, lists, status } = this.props;

    if (!status.done) {
      return <PromiseResult status={status} loadingMessage="Loading base graph info..." />
    }

    if (searchableLens.isEmpty()) {
      return <Layout visualization={<SampleVisualization />} />
    } else {
      return <Layout
        sidebar={<ConfiguratorSidebar />}
        toolbar={<Toolbar />}
        visualization={lists.size > 0 ? <Visualization /> : <SampleVisualization />}
      />
    }
  }
}

const statusSelector = createAggregatedPromiseStatusSelector([
  graphStatusSelector,
  searchableLensStatusSelector,
  getConfigurationStatusSelector ]);

const selector = createStructuredSelector({
  graph: graphSelector,
  searchableLens: searchableLensSelector,
  lists: listsSelector,
  status: statusSelector
});

export default connect(selector)(addBodyPadding(Configurator));
