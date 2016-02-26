import { createSelector } from 'reselect'

/** Select state of this module */
export const moduleSelector = state => state.common;
export default moduleSelector;

export const visualizersSelector = createSelector(
  [moduleSelector],
  state => state.visualizers
);
