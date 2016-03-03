import { createSelector } from 'reselect'
import { Map, fromJS } from 'immutable'
import { _label } from '../../../../misc/lang'
import prefix from '../prefix'
import { createPromiseStatusSelector } from '../../../../ducks/promises'
import { skosConceptsSelector as reducerSelector } from '../selector'
import { SkosConcept } from '../models'

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

// Selectors

export const createSkosConceptsStatusSelector = schemeUriExtractor =>
  createPromiseStatusSelector(GET_SKOS_CONCEPTS, schemeUriExtractor);

export const skosConceptsSelector = createSelector(
  [reducerSelector],
  schemes => schemes.map(concepts => concepts.map(concept =>
    (new SkosConcept(concept)).set('label', _label(concept.get('label')))))
);
