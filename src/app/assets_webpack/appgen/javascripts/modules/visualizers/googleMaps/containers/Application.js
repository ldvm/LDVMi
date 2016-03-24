import React, { Component, PropTypes } from 'react'
import { Map } from 'immutable'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { createAggregatedPromiseStatusSelector } from '../../../core/ducks/promises'
import { queryDataset } from '../actions'
import { getConfiguration } from '../ducks/configuration'
import { getMarkers } from '../ducks/markers'
import { filtersSelector } from '../ducks/filters'
import { publishSettingsSelector } from '../ducks/publishSettings'
import { propertiesStatusSelector } from '../ducks/properties'
import { skosConceptsStatusesSelector } from '../ducks/skosConcepts'
import { getConfigurationStatusSelector } from '../ducks/configuration'
import { PromiseStatus } from "../../../core/models";
import Layout from '../components/Layout'
import PropertiesLoadingStatus from '../components/PropertiesLoadingStatus'
import ApplicationFilters from '../components/ApplicationFilters'
import { PublishSettings } from "../models";

class Application extends Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(queryDataset());
    dispatch(getConfiguration());
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props;

    // This is the very moment when the filters and configuration are loaded into the state. A
    // cleaner solution would probably be chain queryDataset() and getConfiguration() into a single
    // promise and call .then() on it but at this point this is the simplest way to go.
    if (!this.props.status.done && nextProps.status.done) {
      if (nextProps.publishSettings.refreshOnStartUp) {
        dispatch(getMarkers());
      }
    }
  }

  render() {
    const { filters, embed, status } = this.props;

    return <Layout
      insetShadow={!embed}
      sidebar={status.done ?
        <ApplicationFilters filters={filters} /> :
        <PropertiesLoadingStatus status={status} />
      }
    />;
  }
}

Application.propTypes = {
  dispatch: PropTypes.func.isRequired,
  filters: PropTypes.instanceOf(Map).isRequired,
  publishSettings: PropTypes.instanceOf(PublishSettings).isRequired,
  status: PropTypes.instanceOf(PromiseStatus).isRequired,
  embed: PropTypes.bool
};

// Create aggregated status selector to wait until Properties, SkosConcepts and Configuration
// are all loaded.
const statusSelector = createAggregatedPromiseStatusSelector(
  [propertiesStatusSelector, skosConceptsStatusesSelector, getConfigurationStatusSelector]
);

const selector = createStructuredSelector({
  filters: filtersSelector,
  publishSettings: publishSettingsSelector,
  status: statusSelector
});

export default connect(selector)(Application);
