import { Map, fromJS } from 'immutable'
import prefix from '../prefix'

// Actions

export const GET_SKOS_CONCEPTS = prefix('GET_SKOS_CONCEPTS');
export const GET_SKOS_CONCEPTS_START = GET_SKOS_CONCEPTS + '_START';
export const GET_SKOS_CONCEPTS_ERROR = GET_SKOS_CONCEPTS + '_ERROR';
export const GET_SKOS_CONCEPTS_SUCCESS = GET_SKOS_CONCEPTS + '_SUCCESS';

// Reducer

export default function skosConceptsReducer(state = new Map(), action) {
  if (action.type == GET_SKOS_CONCEPTS_SUCCESS) {
    return state.merge(fromJS(action.payload));
  }

  return state;
};
