import { createSelector } from 'reselect'
import parentSelector from '../selector'

/** Select state of this module */
export const moduleSelector = createSelector(
  [parentSelector],
  parentState => parentState.googleMaps
);
export default moduleSelector;

export const propertiesSelector = createSelector(
  [moduleSelector],
  state => state.properties
);

export const skosConceptsSelector = createSelector(
  [moduleSelector],
  state => state.skosConcepts
);

export const skosConceptsCountsSelector = createSelector(
  [moduleSelector],
  state => state.skosConceptsCounts
);

export const filterConfigsSelector = createSelector(
  [moduleSelector],
  state => state.filterConfigs
);

export const propertyConfigsSelector = createSelector(
  [moduleSelector],
  state => state.propertyConfigs
);

export const selectedFiltersSelector = createSelector(
  [moduleSelector],
  state => state.selectedFilters
);

export const markersSelector = createSelector(
  [moduleSelector],
  state => state.markers
);
