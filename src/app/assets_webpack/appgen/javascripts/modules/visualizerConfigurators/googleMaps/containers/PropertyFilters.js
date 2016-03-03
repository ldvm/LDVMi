import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { List, Map } from 'immutable'
import { PromiseStatus } from '../../../../ducks/promises'
import PromiseResult from '../../../../misc/components/PromiseResult'
import PropertyHeaderConfig from '../components/PropertyHeaderConfig'
import PropertyFilterConfig from '../components/PropertyFilterConfig'
import { Property, PropertyConfig } from '../models'
import { skosConceptsSelector, createSkosConceptsStatusSelector } from '../ducks/skosConcepts'
import { skosConceptsCountsSelector, createSkosConceptsCountsStatusSelector } from '../ducks/skosConceptsCounts'
import { configureFilter, configureAllFilters, filterConfigsSelector } from '../ducks/filterConfigs'
import { configureProperty, propertyConfigsSelector } from '../ducks/propertyConfigs'

const PropertyFilter = (props) => {
  const { dispatch, property, propertyConfig, filterConfigs, skosConcepts, skosConceptsUris, skosConceptsCounts, status, countsStatus } = props;

  if (!status.done) {
      return <PromiseResult status={status} />;
  }

  return <div>
    <PropertyHeaderConfig
      property={property}
      config={propertyConfig}
      configureAllFilters={settings => dispatch(configureAllFilters(property.uri, skosConceptsUris, settings))}
      configureProperty={settings => dispatch(configureProperty(property.uri, settings))}
    />
    {propertyConfig.enabled && skosConcepts.map(skosConcept =>
      <PropertyFilterConfig
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

const selector = createSelector(
  [propertySelector, propertyConfigsSelector, filterConfigsSelector,
    skosConceptsSelector, skosConceptsCountsSelector,
    skosConceptsStatusSelector, skosConceptsCountsStatusSelector],
  (property, propertyConfigs, filterConfigs, skosConcepts, skosConceptsCounts, status, countsStatus) => ({
    property,
    propertyConfig: propertyConfigs.get(property.uri) || new PropertyConfig(),
    filterConfigs: filterConfigs.get(property.uri) || Map(),
    skosConcepts: skosConcepts.get(property.schemeUri) || List(),
    skosConceptsUris: (skosConcepts.get(property.schemeUri) || List()).map(concept => concept.uri),
    skosConceptsCounts: skosConceptsCounts.get(property.uri) || Map(),
    status,
    countsStatus
  })
);

export default connect(selector)(PropertyFilter);
