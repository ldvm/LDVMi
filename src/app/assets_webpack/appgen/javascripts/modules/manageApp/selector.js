import { createSelector } from 'reselect'
import parentSelector from '../selector'
import { MODULE_PREFIX } from './prefix'

export const moduleSelector = createSelector([parentSelector], parentState => parentState[MODULE_PREFIX]);
export default moduleSelector;

export const applicationSelector = createSelector(
  [moduleSelector],
  state => state.application
);
