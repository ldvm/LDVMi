import React, { Component, PropTypes } from 'react'
import { OrderedMap } from 'immutable'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { createAggregatedPromiseStatusSelector } from '../../../core/ducks/promises'
import { getGraph, graphSelector, graphStatusSelector } from '../ducks/graph'
import { getSearchableLens, searchableLensSelector, searchableLensStatusSelector } from '../ducks/searchableLens'
import { getConfiguration, getConfigurationStatusSelector } from '../ducks/configuration'
import { listsSelector } from '../ducks/lists'
import { selectList } from '../ducks/selectedList'
import { publishSettingsSelector } from '../ducks/publishSettings'
import PromiseResult from '../../../core/components/PromiseResult'
import { PromiseStatus } from '../../../core/models'
import { Lens, Graph, PublishSettings } from '../models'
import { addBodyPadding } from '../../../../components/BodyPadding'
import SampleVisualization from './SampleVisualization'
import Visualization from './Visualization'
import Layout from '../components/Layout'

class Application extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    graph: PropTypes.instanceOf(Graph).isRequired,
    searchableLens: PropTypes.instanceOf(Lens).isRequired,
    lists: PropTypes.instanceOf(OrderedMap),
    publishSettings: PropTypes.instanceOf(PublishSettings).isRequired,
    status: PropTypes.instanceOf(PromiseStatus).isRequired,
    embed: PropTypes.bool,
    listId: PropTypes.string
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(getGraph());
    dispatch(getSearchableLens());
    dispatch(getConfiguration());
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, listId } = this.props;

    // This is the moment when everything finishes loading. The cleaner way to go would be probably
    // to chain the action using promises...
    if (!this.props.status.done && nextProps.status.done) {
      if (listId) {
        dispatch(selectList(listId));
      }
    }
  }

  render() {
    const { searchableLens, lists, embed, status } = this.props;

    if (!status.done) {
      return <PromiseResult status={status} loadingMessage="Loading base graph info..." />
    }

    if (searchableLens.isEmpty()) {
      return <Layout visualization={<SampleVisualization />} />
    } else {
      return <Layout
        sidebar={!embed && <div>here be application sidebar</div>}
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
  publishSettings: publishSettingsSelector,
  status: statusSelector
});

export default connect(selector)(addBodyPadding(Application));
