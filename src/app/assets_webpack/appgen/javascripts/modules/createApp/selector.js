import { createSelector } from 'reselect'
import { List } from 'immutable'
import { DataSource } from './models'
import parentSelector from '../selector'
import { MODULE_PREFIX } from './prefix'

export const moduleSelector = createSelector([parentSelector], parentState => parentState[MODULE_PREFIX]);
export default moduleSelector;

export const discoverySelector = createSelector(
  [moduleSelector],
  state => state.discovery
);

export const evaluationsSelector = createSelector(
  [moduleSelector],
  state => state.evaluations
);
