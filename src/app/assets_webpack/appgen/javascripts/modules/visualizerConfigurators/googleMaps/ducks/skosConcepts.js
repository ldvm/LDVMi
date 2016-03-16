import { createSelector } from 'reselect'
import { List, Map, fromJS } from 'immutable'
import prefix from '../prefix'
import { arrayToObject } from '../../../../misc/utils'
import { createPromiseStatusSelector, createPromiseStatusesSelector } from '../../../../ducks/promises'
import moduleSelector  from '../selector'
import { SkosConcept } from '../models'

// Actions

export const GET_SKOS_CONCEPTS = prefix('GET_SKOS_CONCEPTS');
export const GET_SKOS_CONCEPTS_START = GET_SKOS_CONCEPTS + '_START';
export const GET_SKOS_CONCEPTS_ERROR = GET_SKOS_CONCEPTS + '_ERROR';
export const GET_SKOS_CONCEPTS_SUCCESS = GET_SKOS_CONCEPTS + '_SUCCESS';

// Reducer

export default function skosConceptsReducer(state = new Map(), action) {
  if (action.type == GET_SKOS_CONCEPTS_SUCCESS) {
    const update = (new Map(action.payload)).map(conceptsForScheme =>
      (new Map(arrayToObject(conceptsForScheme, concept => concept.uri)))
        .map(concept => new SkosConcept(concept)));

    return state.merge(update);
  }

  return state;
};

// Selectors

export const createSkosConceptsStatusSelector = schemeUriExtractor =>
  createPromiseStatusSelector(GET_SKOS_CONCEPTS, schemeUriExtractor);

export const skosConceptsStatusesSelector = createPromiseStatusesSelector(GET_SKOS_CONCEPTS);
