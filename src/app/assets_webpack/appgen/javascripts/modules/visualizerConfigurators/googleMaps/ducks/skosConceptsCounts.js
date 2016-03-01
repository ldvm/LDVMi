import { Map, fromJS } from 'immutable'
import prefix from '../prefix'

// Actions

export const GET_SKOS_CONCEPTS_COUNTS = prefix('GET_SKOS_CONCEPTS_COUNTS');
export const GET_SKOS_CONCEPTS_COUNTS_START = GET_SKOS_CONCEPTS_COUNTS + '_START';
export const GET_SKOS_CONCEPTS_COUNTS_ERROR = GET_SKOS_CONCEPTS_COUNTS + '_ERROR';
export const GET_SKOS_CONCEPTS_COUNTS_SUCCESS = GET_SKOS_CONCEPTS_COUNTS + '_SUCCESS';

// Reducer

export default function skosConceptsReducer(state = new Map(), action) {
  if (action.type == GET_SKOS_CONCEPTS_COUNTS_SUCCESS) {
    return state.merge(fromJS(action.payload));
  }

  return state;
};
