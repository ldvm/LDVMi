import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { List, Map } from 'immutable'
import { PromiseStatus } from '../../../../ducks/promises'
import PromiseResult from '../../../../misc/components/PromiseResult'
import PropertyHeaderConfig from '../components/PropertyHeaderConfig'
import FilterConfig from '../components/FilterConfig'
import { Property } from '../models'
import { skosConceptsSelector, createSkosConceptsStatusSelector } from '../ducks/skosConcepts'
import { skosConceptsCountsSelector, createSkosConceptsCountsStatusSelector } from '../ducks/skosConceptsCounts'
import { filterConfigsSelector } from '../ducks/filterConfigs'
import { configureFilter, configureAllFilters } from '../ducks/filterConfigs'

const PropertyFilter = (props) => {
  const { dispatch, property, filterConfigs, skosConcepts, skosConceptsUris, skosConceptsCounts, status, countsStatus } = props;

  if (!status.done) {
      return <PromiseResult status={status} />;
  }

  return <div>
    <PropertyHeaderConfig
      property={property}
      configureAllFilters={settings => dispatch(configureAllFilters(property.uri, skosConceptsUris, settings))}
    />
    {skosConcepts.map(skosConcept =>
      <FilterConfig
        key={skosConcept.uri}
        skosConcept={skosConcept}
        count={skosConceptsCounts.get(skosConcept.uri)}
        countLoading={countsStatus.isLoading}
        configureFilter={settings => dispatch(configureFilter(property.uri, skosConcept.uri, settings))}
        config={filterConfigs.get(skosConcept.uri)}
      />
    )}
  </div>;
};

PropertyFilter.propTypes = {
  dispatch: PropTypes.func.isRequired,
  property: PropTypes.instanceOf(Property).isRequired,
  filterConfigs: PropTypes.instanceOf(Map).isRequired,
  skosConcepts: PropTypes.instanceOf(List).isRequired,
  skosConceptsUris: PropTypes.instanceOf(List).isRequired,
  skosConceptsCounts: PropTypes.instanceOf(Map).isRequired,
  status: PropTypes.instanceOf(PromiseStatus).isRequired,
  countsStatus: PropTypes.instanceOf(PromiseStatus).isRequired
};

const propertySelector = (state, props) => props.property;

const skosConceptsStatusSelector = createSkosConceptsStatusSelector(
  (state, props) => props.property.schemeUri);

const skosConceptsCountsStatusSelector = createSkosConceptsCountsStatusSelector(
  (state, props) => props.property.uri);

const selector = createSelector(
  [propertySelector, filterConfigsSelector,
    skosConceptsSelector, skosConceptsCountsSelector,
    skosConceptsStatusSelector, skosConceptsCountsStatusSelector],
  (property, filterConfigs, skosConcepts, skosConceptsCounts, status, countsStatus) => ({
    property,
    filterConfigs: filterConfigs.get(property.uri) || Map(),
    skosConcepts: skosConcepts.get(property.schemeUri) || List(),
    skosConceptsUris: (skosConcepts.get(property.schemeUri) || List()).map(concept => concept.uri),
    skosConceptsCounts: skosConceptsCounts.get(property.uri) || Map(),
    status,
    countsStatus
  })
);

export default connect(selector)(PropertyFilter);
