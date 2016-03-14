import { Map, fromJS } from 'immutable'
import { createSelector } from 'reselect'
import moduleSelector  from '../selector'
import prefix from '../prefix'
import createAction from '../../../../misc/createAction'
import { filterConfigsSelector as reducerSelector } from '../selector'

// Actions

export const CONFIGURE_OPTION = prefix('CONFIGURE_OPTION');
export const CONFIGURE_ALL_OPTIONS = prefix('CONFIGURE_ALL_OPTIONS');

export function configureOption(propertyUri, skosConceptUri, settings) {
  return createAction(CONFIGURE_OPTION, { propertyUri, skosConceptUri, settings });
}

export function configureAllOptions(propertyUri, skosConceptUris, settings) {
  return createAction(CONFIGURE_ALL_OPTIONS, { propertyUri, skosConceptUris, settings });
}

export function selectOption(propertyUri, skosConceptUri, selected) {
  return configureOption(propertyUri, skosConceptUri, { selected });
}

export function selectAllOptions(propertyUri, skosConceptUris, selected) {
  return configureOption(propertyUri, skosConceptUris, { selected });
}

// Reducer

export default function filterConfigsReducer(state = new Map(), action) {
  switch (action.type) {

    case CONFIGURE_OPTION: return (() => { // Grrr. Separated scope needed to avoid const redeclaration
      const { propertyUri, skosConceptUri, settings } = action.payload;
      const update = fromJS({
        [propertyUri]: {
          [skosConceptUri]: settings
        }});
      return state.mergeDeep(update);
    })();

    case CONFIGURE_ALL_OPTIONS: return (() => {
      var { propertyUri, skosConceptUris, settings } = action.payload;

      // Replicate settings for each skos concept
      const options = {};
      skosConceptUris.forEach(uri => options[uri] = settings);

      const update = fromJS({ [propertyUri]: options });
      return state.mergeDeep(update);
    })();
  }

  return state;
}

// Selectors

export const optionsConfigSelector = createSelector([moduleSelector], state => state.options);
