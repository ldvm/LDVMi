import React, { Component, PropTypes } from 'react'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { getGraph, graphSelector, graphStatusSelector } from '../ducks/graph'
import { getSearchableLens, searchableLensSelector, searchableLensStatusSelector } from '../ducks/searchableLens'
import { getConfiguration } from '../ducks/configuration'
import { Lens, Graph } from '../models'
import { PromiseStatus } from '../../../core/models'
import PromiseResult from '../../../core/components/PromiseResult'
import { createAggregatedPromiseStatusSelector } from '../../../core/ducks/promises'
import { addBodyPadding } from '../../../../components/BodyPadding'
import ConfiguratorSimple from './ConfiguratorSimple'
import ConfiguratorSearchable from './ConfiguratorSearchable'

class Configurator extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    graph: PropTypes.instanceOf(Graph).isRequired,
    searchableLens: PropTypes.instanceOf(Lens).isRequired,
    status: PropTypes.instanceOf(PromiseStatus).isRequired
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(getGraph());
    dispatch(getSearchableLens());
    dispatch(getConfiguration());
  }

  render() {
    const { searchableLens, status } = this.props;

    if (!status.done) {
      return <PromiseResult status={status} loadingMessage="Loading base graph info..." />
    }

    return searchableLens.isEmpty() ?
      <ConfiguratorSimple /> :
      <ConfiguratorSearchable />;
  }
}

const statusSelector = createAggregatedPromiseStatusSelector([
  graphStatusSelector,
  searchableLensStatusSelector]);

const selector = createStructuredSelector({
  graph: graphSelector,
  searchableLens: searchableLensSelector,
  status: statusSelector
});

export default connect(selector)(addBodyPadding(Configurator));
