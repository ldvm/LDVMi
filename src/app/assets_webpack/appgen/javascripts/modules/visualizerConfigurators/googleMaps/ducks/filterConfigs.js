import { Map } from 'immutable'
import prefix from '../prefix'
import createAction from '../../../../misc/createAction'
import { filterConfigsSelector as reducerSelector } from '../selector'

// Reducer that maintains the configuration of individual filters.

// Enum definition

export const settings = {
  SELECT_ALWAYS: 'SELECT_ALWAYS',
  SELECT_NEVER: 'SELECT_NEVER',
  USER_DEFINED: 'USER_DEFINED'
};

// Actions

export const CONFIGURE_FILTER = prefix('CONFIGURE_FILTER');
export const CONFIGURE_ALL_FILTERS = prefix('CONFIGURE_ALL_FILTERS');

export function configureFilter(propertyUri, skosConceptUri, settings) {
  return createAction(CONFIGURE_FILTER, { propertyUri, skosConceptUri, settings });
}

export function configureAllFilters(propertyUri, skosConceptUris, settings) {
  return createAction(CONFIGURE_ALL_FILTERS, { propertyUri, skosConceptUris, settings });
}

// Reducer

const initialState = new Map();

export default function filterConfigsReducer(state = initialState, action) {
  switch (action.type) {

    case CONFIGURE_FILTER: return (() => { // Grrr. Separated scope needed to avoid cont redeclaration
        const { propertyUri, skosConceptUri, settings } = action.payload;
        return state.update(propertyUri,
          filters => (filters || new Map()).set(skosConceptUri, settings));
      })();

    case CONFIGURE_ALL_FILTERS: return (() => {
        var { propertyUri, skosConceptUris, settings } = action.payload;
        return state.update(propertyUri,
          filters => new Map(skosConceptUris.map(uri => ([uri, settings]))));
      })();
  }

  return state;
}

// Selector

export const filterConfigsSelector = reducerSelector;
