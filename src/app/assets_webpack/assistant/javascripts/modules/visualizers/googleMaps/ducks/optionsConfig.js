import { fromJS, Map } from 'immutable'
import prefix from '../prefix'
import createAction from '../../../../misc/createAction'
import { CONFIGURE_FILTER } from './filtersConfig'
import { Option, optionModes as modes } from '../models'
import { GET_CONFIGURATION_SUCCESS } from './configuration'
import { GET_APPLICATION_START } from '../../../app/ducks/application'

/**
 * Check the option config update and make sure that the 'selected' property is consistent with
 * the corresponding option mode.
 */
export function validateOptionsUpdate(state, update) {
  return update.map((options, propertyUri) =>
    options.map((optionUpdate, skosConceptUri) => {
      const currentOption = state.getIn([propertyUri, skosConceptUri]) || new Option();
      let nextMode = optionUpdate.has('mode') ? optionUpdate.get('mode') : currentOption.get('mode');
      let nextSelected = optionUpdate.has('selected') ? optionUpdate.get('selected') : currentOption.get('selected');

      if (nextMode == modes.SELECT_ALWAYS) {
        nextSelected = true;
      }
      if (nextMode == modes.SELECT_NEVER) {
        nextSelected = false;
      }

      return optionUpdate
        .set('mode', nextMode)
        .set('selected', nextSelected);
    }));
}

// Actions

export const CONFIGURE_OPTION = prefix('CONFIGURE_OPTION');
export const CONFIGURE_ALL_OPTIONS = prefix('CONFIGURE_ALL_OPTIONS');

export function configureOption(propertyUri, skosConceptUri, settings) {
  const update = fromJS({
    [propertyUri]: {
      [skosConceptUri]: settings
    }
  });

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

const initialState = new Map();

export default function optionsConfigsReducer(state = initialState, action) {
  let update;

  switch (action.type) {
    case GET_APPLICATION_START:
      return initialState;

    case GET_CONFIGURATION_SUCCESS:
      if ("optionsConfig" in action.payload) {
        return initialState.mergeDeep(action.payload.optionsConfig);
      }
      break;

    case CONFIGURE_OPTION:
    case CONFIGURE_ALL_OPTIONS:
      update = validateOptionsUpdate(state, action.payload.update);
      return state.mergeDeep(update);

    case CONFIGURE_FILTER:
      // Deselect all options in case the whole filter changes.
      update = state
        .filter((_, propertyUri) => propertyUri == action.payload.propertyUri)
        .map(options => options.map(option => option.set('selected', false)));
      return state.mergeDeep(validateOptionsUpdate(state, update));
  }

  return state;
}

