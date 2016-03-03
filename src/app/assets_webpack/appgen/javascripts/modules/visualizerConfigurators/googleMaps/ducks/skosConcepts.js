import { createSelector } from 'reselect'
import { List, Map, fromJS } from 'immutable'
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
    const payload = (new Map(action.payload)).map(
      concepts => new List(concepts.map(concept =>
        new SkosConcept({
          ...concept,
          label: _label(concept.label)
        })
      )));
    return state.merge(payload);
  }

  return state;
};

// Selectors

export const createSkosConceptsStatusSelector = schemeUriExtractor =>
  createPromiseStatusSelector(GET_SKOS_CONCEPTS, schemeUriExtractor);

export const skosConceptsSelector = reducerSelector;
