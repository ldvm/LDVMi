import { List, fromJS } from 'immutable'
import { createSelector } from 'reselect'
import { createPromiseStatusSelector } from '../../core/ducks/promises'
import prefix from '../prefix'
import * as api from '../api'
import createAction from '../../../misc/createAction'
import storageReducerFactory from '../../../misc/storageReducerFactory'
import moduleSelector from '../selector'

// Actions

export const INSTALL = prefix('INSTALL');
export const INSTALL_START = INSTALL + '_START';
export const INSTALL_ERROR = INSTALL + '_ERROR';
export const INSTALL_SUCCESS = INSTALL + '_SUCCESS';

export function install() {
  const promise = api.install();
  return createAction(INSTALL, { promise });
}

// Reducer

export default storageReducerFactory()
  .setInitialState(new List())
  .setResetAction(INSTALL_START)
  .setUpdateAction(INSTALL_SUCCESS)
  .setUpdate((state, payload) => fromJS(payload))
  .create();


// Selectors

export const installStatusSelector = createPromiseStatusSelector(INSTALL);
export const installResultsSelector = createSelector([moduleSelector], state => state.install);
