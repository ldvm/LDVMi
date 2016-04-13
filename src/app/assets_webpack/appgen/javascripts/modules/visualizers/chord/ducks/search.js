import { createSelector } from 'reselect'
import { List, fromJS } from 'immutable'
import { createPromiseStatusSelector } from '../../../core/ducks/promises'
import createAction from '../../../../misc/createAction'
import prefix from '../prefix'
import { GET_APPLICATION_START } from '../../../manageApp/ducks/application'
import * as api from '../api'
import moduleSelector from '../selector'
import { ResourceThroughLens } from '../models'

// Actions

export const SEARCH = prefix('SEARCH');
export const SEARCH_START = SEARCH + '_START';
export const SEARCH_ERROR = SEARCH + '_ERROR';
export const SEARCH_SUCCESS = SEARCH + '_SUCCESS';

export function search(id, needle) {
  const promise = api.searchNodes(id, needle);
  return createAction(SEARCH, { promise });
}

// Reducer

const initialState = new List();

export default function searchReducer(state = initialState, action) {
  switch (action.type) {
    case GET_APPLICATION_START:
      return initialState;

    case SEARCH_SUCCESS:
      return (new List(action.payload)).map(resource =>
        new ResourceThroughLens(fromJS(resource)));
  }

  return state;

};

// Selectors

export const searchStatusSelector = createPromiseStatusSelector(SEARCH);
export const searchSelector = createSelector([moduleSelector], state => state.search);
