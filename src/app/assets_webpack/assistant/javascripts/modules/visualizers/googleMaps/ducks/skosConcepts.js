import { Map } from 'immutable'
import prefix from '../prefix'
import { arrayToObject } from '../../../../misc/utils'
import { createPromiseStatusesSelector, createPromiseStatusSelector } from '../../../core/ducks/promises'
import { SkosConcept } from '../models'
import { GET_APPLICATION_START } from '../../../app/ducks/application'

// Actions

export const GET_SKOS_CONCEPTS = prefix('GET_SKOS_CONCEPTS');
export const GET_SKOS_CONCEPTS_START = GET_SKOS_CONCEPTS + '_START';
export const GET_SKOS_CONCEPTS_ERROR = GET_SKOS_CONCEPTS + '_ERROR';
export const GET_SKOS_CONCEPTS_SUCCESS = GET_SKOS_CONCEPTS + '_SUCCESS';

// Reducer

const initialState = new Map();

export default function skosConceptsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_APPLICATION_START:
      return initialState;

    case GET_SKOS_CONCEPTS_SUCCESS:
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
