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
