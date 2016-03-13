import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { List, Map } from 'immutable'
import { PromiseStatus } from '../../../../ducks/promises'
import PromiseResult from '../../../../misc/components/PromiseResult'
import PropertyHeader from '../components/PropertyHeader'
import PropertyFilter from '../components/PropertyFilter'
import { Property, PropertyConfig } from '../models'
import { skosConceptsSelector, createSkosConceptsStatusSelector } from '../ducks/skosConcepts'
import { skosConceptsCountsSelector, createSkosConceptsCountsStatusSelector } from '../ducks/skosConceptsCounts'
import { configureFilter, configureAllFilters, filterConfigsSelector } from '../ducks/filterConfigs'
import { configureProperty, propertyConfigsSelector } from '../ducks/propertyConfigs'
import { selectFilter } from '../ducks/selectedFilters'
import { settings } from  '../ducks/filterConfigs'

const PropertyFilters = (props) => {
  const { dispatch, property, propertyConfig, filterConfigs, skosConcepts, skosConceptsUris, skosConceptsCounts, status, countsStatus } = props;

  if (!status.done) {
      return <PromiseResult status={status} />;
  }

  if (!propertyConfig.enabled) {
    return <div></div>;
  }

  return <div>
    <PropertyHeader
      property={property}
      config={propertyConfig}
    />
    {propertyConfig.enabled && skosConcepts.map(skosConcept =>
      <PropertyFilter
        key={skosConcept.uri}
        skosConcept={skosConcept}
        count={skosConceptsCounts.get(skosConcept.uri)}
        countLoading={countsStatus.isLoading}
        config={filterConfigs.get(skosConcept.uri)}
        onSelect={isActive => dispatch(selectFilter(property.uri, skosConcept.uri, isActive))}
      />
    )}
  </div>;
};

PropertyFilters.propTypes = {
  dispatch: PropTypes.func.isRequired,
  property: PropTypes.instanceOf(Property).isRequired,
  propertyConfig: PropTypes.instanceOf(PropertyConfig).isRequired,
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

const propertyFilterConfigsSelector = createSelector(
  [propertySelector, filterConfigsSelector],
  (property, filterConfigs) => filterConfigs.get(property.uri) || Map()
);

const propertySkosConceptsSelector = createSelector(
  [propertySelector, skosConceptsSelector],
  (property, skosConcepts) => skosConcepts.get(property.schemeUri) || List()
);

const enabledSkosConceptsSelector = createSelector(
  [propertySkosConceptsSelector, propertyFilterConfigsSelector],
  (skosConcepts, filterConfigs) =>
    skosConcepts.filter(skosConcept => filterConfigs.get(skosConcept.uri) != settings.SELECT_NEVER)
);

const selector = createSelector(
  [propertySelector, propertyConfigsSelector, propertyFilterConfigsSelector,
    enabledSkosConceptsSelector, skosConceptsCountsSelector,
    skosConceptsStatusSelector, skosConceptsCountsStatusSelector],
  (property, propertyConfigs, filterConfigs, skosConcepts, skosConceptsCounts, status, countsStatus) => ({
    property,
    propertyConfig: propertyConfigs.get(property.uri) || new PropertyConfig(),
    filterConfigs,
    skosConcepts,
    skosConceptsUris: skosConcepts.map(concept => concept.uri),
    skosConceptsCounts: skosConceptsCounts.get(property.uri) || Map(),
    status,
    countsStatus
  })
);

export default connect(selector)(PropertyFilters);
