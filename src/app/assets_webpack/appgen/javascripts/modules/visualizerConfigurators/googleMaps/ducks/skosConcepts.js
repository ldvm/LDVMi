import { createSelector } from 'reselect'
import { List, Map, fromJS } from 'immutable'
import { _label } from '../../../../misc/lang'
import prefix from '../prefix'
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
    return state.merge(fromJS(action.payload));
  }

  return state;
};

// Selectors

export const createSkosConceptsStatusSelector = schemeUriExtractor =>
  createPromiseStatusSelector(GET_SKOS_CONCEPTS, schemeUriExtractor);

export const skosConceptsStatusesSelector = createPromiseStatusesSelector(GET_SKOS_CONCEPTS);

export const skosConceptsSelector = createSelector(
  [moduleSelector],

  // Concepts are grouped by scheme.
  state => state.skosConcepts.map(conceptsForScheme =>
    conceptsForScheme.map(concept =>
      new SkosConcept({
        ...concept.toJS(),
        label: _label(concept.get('label'))
      })
  ))
);
