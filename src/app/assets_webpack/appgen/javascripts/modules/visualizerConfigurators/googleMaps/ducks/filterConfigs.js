import { Map } from 'immutable'
import prefix from '../prefix'
import createAction from '../../../../misc/createAction'

// Reducer that maintains the configuration of individual filters.

// Enum definition

export const settings = {
  SELECT_ALWAYS: 'SELECT_ALWAYS',
  SELECT_NEVER: 'SELECT_NEVER',
  USER_DEFINED: 'USER_DEFINED'
};

// Actions

export const CONFIGURE_FILTER = prefix('CONFIGURE_FILTER');

export function configureFilter(propertyUri, skosConceptUri, settings) {
  return createAction(CONFIGURE_FILTER, { propertyUri, skosConceptUri, settings });
}

// Reducer

const initialState = new Map();

export default function filterConfigsReducer(state = initialState, action) {
  switch (action.type) {
    case (CONFIGURE_FILTER):
      const { propertyUri, skosConceptUri, settings } = action.payload;
      return state.update(propertyUri,
        filters => (filters || new Map()).set(skosConceptUri, settings));
  }

  return state;
}
