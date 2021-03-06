import { createSelector } from 'reselect'
import { fromJS } from 'immutable'
import prefix from '../prefix'
import moduleSelector from '../selector'
import createAction from '../../../../misc/createAction'
import { createPromiseStatusSelector } from '../../../core/ducks/promises'
import { Lens } from '../models'
import { GET_APPLICATION_START } from '../../../app/ducks/application'
import * as api from '../api'
import withApplicationId from '../../../app/misc/withApplicationId'

// Actions

export const GET_SEARCHABLE_LENS = prefix('GET_SEARCHABLE_LENS');
export const GET_SEARCHABLE_LENS_START = GET_SEARCHABLE_LENS + '_START';
export const GET_SEARCHABLE_LENS_ERROR = GET_SEARCHABLE_LENS + '_ERROR';
export const GET_SEARCHABLE_LENS_SUCCESS = GET_SEARCHABLE_LENS + '_SUCCESS';
export const GET_SEARCHABLE_LENS_RESET = GET_SEARCHABLE_LENS + '_RESET';

export function getSearchableLens() {
  return withApplicationId(id => {
    const promise = api.getSearchableLens(id);
    return createAction(GET_SEARCHABLE_LENS , { promise });
  })
}

export function getSearchableLensReset() {
  return createAction(GET_SEARCHABLE_LENS_RESET);
}

// Reducer

const initialState = new Lens();

export default function searchableLensReducer(state = initialState, action) {
  switch (action.type) {
    case GET_APPLICATION_START:
    case GET_SEARCHABLE_LENS_RESET:
      return initialState;

    case GET_SEARCHABLE_LENS_SUCCESS:
      return new Lens(fromJS(action.payload));
  }

  return state;
};

// Selectors

export const searchableLensStatusSelector = createPromiseStatusSelector(GET_SEARCHABLE_LENS);

export const searchableLensSelector = createSelector([moduleSelector], state => state.searchableLens);
