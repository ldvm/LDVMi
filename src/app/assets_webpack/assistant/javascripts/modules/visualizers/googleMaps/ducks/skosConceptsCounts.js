import { fromJS, Map } from 'immutable'
import { createSelector } from 'reselect'
import { createPromiseStatusSelector } from '../../../core/ducks/promises'
import prefix from '../prefix'
import moduleSelector from '../selector'
import { GET_APPLICATION_START } from '../../../app/ducks/application'

// Actions

export const GET_SKOS_CONCEPTS_COUNTS = prefix('GET_SKOS_CONCEPTS_COUNTS');
export const GET_SKOS_CONCEPTS_COUNTS_START = GET_SKOS_CONCEPTS_COUNTS + '_START';
export const GET_SKOS_CONCEPTS_COUNTS_ERROR = GET_SKOS_CONCEPTS_COUNTS + '_ERROR';
export const GET_SKOS_CONCEPTS_COUNTS_SUCCESS = GET_SKOS_CONCEPTS_COUNTS + '_SUCCESS';

// Reducer

const initialState = new Map();

export default function skosConceptsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_APPLICATION_START:
      return initialState;

    case GET_SKOS_CONCEPTS_COUNTS_SUCCESS:
      return state.merge(fromJS(action.payload));
  }

  return state;
};

// Selectors

export const createSkosConceptsCountsStatusSelector = propertyUriExtractor =>
  createPromiseStatusSelector(GET_SKOS_CONCEPTS_COUNTS, propertyUriExtractor);

export const skosConceptsCountsSelector = createSelector(
  [moduleSelector],
  state => state.skosConceptsCounts
);
