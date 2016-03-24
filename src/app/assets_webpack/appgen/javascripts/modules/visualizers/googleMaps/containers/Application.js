import React, { Component, PropTypes } from 'react'
import { Map } from 'immutable'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { queryDataset } from '../actions'
import { getConfiguration } from '../ducks/configuration'
import Layout from '../components/Layout'
import { createAggregatedPromiseStatusSelector } from '../../../core/ducks/promises'
import { filtersSelector } from '../ducks/filters'
import { propertiesStatusSelector } from '../ducks/properties'
import { skosConceptsStatusesSelector } from '../ducks/skosConcepts'
import { getConfigurationStatusSelector } from '../ducks/configuration'
import { PromiseStatus } from "../../../core/models";
import PropertiesLoadingStatus from '../components/PropertiesLoadingStatus'
import ApplicationFilters from '../components/ApplicationFilters'

class Application extends Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(queryDataset());
    dispatch(getConfiguration());
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
  filters: PropTypes.instanceOf(Map),
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
  status: statusSelector
});

export default connect(selector)(Application);
