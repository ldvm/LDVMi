import { createSelector } from 'reselect'
import { Map, fromJS } from 'immutable'
import prefix from '../prefix'
import createAction from '../../../misc/createAction'
import moduleSelector from '../selector'

// Actions

export const UPDATE_CUSTOM_LABEL = prefix('UPDATE_CUSTOM_LABEL');
export function updateCustomLabel(resourceUri, variants) {
  return createAction(UPDATE_CUSTOM_LABEL, { [resourceUri]: { variants }});
}

// Reducer

export default function customLabelsReducer(state = new Map(), action) {
  switch (action.type) {
    case UPDATE_CUSTOM_LABEL:
      return state.mergeDeep(fromJS(action.payload));
      break;
  }
  
  return state;
}

// Selectors

export const customLabelsSelector = createSelector(
  [moduleSelector],
  parentState => parentState.customLabels
);
