import { createSelector } from 'reselect'
import { List, fromJS } from 'immutable'
import { createPromiseStatusSelector } from '../../../core/ducks/promises'
import createAction from '../../../../misc/createAction'
import prefix from '../prefix'
import { GET_APPLICATION_START } from '../../../app/ducks/application'
import * as api from '../api'
import moduleSelector from '../selector'
import { ResourceThroughLens } from '../models'
import storageReducerFactory from '../../../../misc/storageReducerFactory'
import withApplicationId from '../../../app/misc/withApplicationId'

// Actions

export const SEARCH = prefix('SEARCH');
export const SEARCH_START = SEARCH + '_START';
export const SEARCH_ERROR = SEARCH + '_ERROR';
export const SEARCH_SUCCESS = SEARCH + '_SUCCESS';

export function search(needle) {
  return withApplicationId(id => {
    const promise = api.searchNodes(id, needle);
    return createAction(SEARCH, { promise });
  });
}

// Reducer

export default storageReducerFactory()
  .setInitialState(new List())
  .setResetAction(GET_APPLICATION_START)
  .setUpdateAction(SEARCH_SUCCESS)
  .setUpdate((state, payload) => {
    return (new List(payload))
      .map(resource => new ResourceThroughLens(fromJS(resource)))
  })
  .create();

// Selectors

export const searchStatusSelector = createPromiseStatusSelector(SEARCH);
export const searchSelector = createSelector([moduleSelector], state => state.search);
