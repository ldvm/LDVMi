import { createSelector } from 'reselect'

/** Select state of this module */
export const moduleSelector = state => state.manageApp;
export default moduleSelector;

export const applicationSelector = createSelector(
  [moduleSelector],
  state => state.application
);
