import { Map, List } from 'immutable'
import prefix from '../prefix'
import createAction from '../../../../misc/createAction'
import { selectedFiltersSelector as reducerSelector } from '../selector'

// Actions

export const SELECT_FILTER = prefix('SELECT_FILTER');

export function selectFilter(propertyUri, skosConceptUri, isActive) {
  return createAction(SELECT_FILTER, { propertyUri, skosConceptUri, isActive });
}

// Reducer

const initialState = new Map();

export default function selectedFiltersReducer(state = initialState, action) {
  switch (action.type) {

    case SELECT_FILTER: return (() => { // Grrr. Separated scope needed to avoid const redeclaration
      const { propertyUri, skosConceptUri, isActive} = action.payload;
      return state.update(propertyUri,
        filters => (filters || new List())
          .filter(filter => filter.get('uri') != skosConceptUri)
          .push(new Map({ uri: skosConceptUri, isActive })));
    })();
  }

  return state;
}

// Selectors

export const selectedFiltersSelector = reducerSelector;
