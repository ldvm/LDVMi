import { createSelector } from 'reselect'
import { Map, fromJS } from 'immutable'
import prefix from '../prefix'
import createAction from '../../../misc/createAction'
import moduleSelector from '../selector'
import { GET_CONFIGURATION_SUCCESS } from './configuration'
import { GET_APPLICATION_START } from './application'

// Actions

export const UPDATE_CUSTOM_LABEL = prefix('UPDATE_CUSTOM_LABEL');
export function updateCustomLabel(resourceUri, variants) {
  return createAction(UPDATE_CUSTOM_LABEL, { resourceUri, variants });
}

// Reducer

const initialState = new Map();

export default function customLabelsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_APPLICATION_START:
      return initialState;

    case GET_CONFIGURATION_SUCCESS:
      if ("customLabels" in action.payload) {
        return initialState.mergeDeep(action.payload.customLabels);
      }
      break;

    case UPDATE_CUSTOM_LABEL:
      const { resourceUri, variants } = action.payload;
      return state.setIn([resourceUri, 'variants'], fromJS(variants));
      break;
  }
  
  return state;
}

// Selectors

export const customLabelsSelector = createSelector(
  [moduleSelector],
  parentState => parentState.customLabels
);
