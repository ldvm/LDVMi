import { Map, fromJS } from 'immutable'
import prefix from '../prefix'
import createAction from '../../../../misc/createAction'

// Actions

export const CONFIGURE_OPTION = prefix('CONFIGURE_OPTION');
export const CONFIGURE_ALL_OPTIONS = prefix('CONFIGURE_ALL_OPTIONS');

export function configureOption(propertyUri, skosConceptUri, settings) {
  const update = fromJS({
    [propertyUri]: {
      [skosConceptUri]: settings
    }});

  return createAction(CONFIGURE_OPTION, { update });
}

export function configureAllOptions(propertyUri, skosConceptUris, settings) {
  // Replicate settings for each skos concept
  const options = {};
  skosConceptUris.forEach(uri => options[uri] = settings);
  const update = fromJS({ [propertyUri]: options });

  return createAction(CONFIGURE_ALL_OPTIONS, { update });
}

export function selectOption(propertyUri, skosConceptUri, selected) {
  return configureOption(propertyUri, skosConceptUri, { selected });
}

export function selectAllOptions(propertyUri, skosConceptUris, selected) {
  return configureAllOptions(propertyUri, skosConceptUris, { selected });
}

// Reducer

export default function filterConfigsReducer(state = new Map(), action) {
  switch (action.type) {
    case CONFIGURE_OPTION:
    case CONFIGURE_ALL_OPTIONS:
      return state.mergeDeep(action.payload.update);
  }

  return state;
}

