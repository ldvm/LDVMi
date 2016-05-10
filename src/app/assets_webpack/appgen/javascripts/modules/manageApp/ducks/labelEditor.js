import { createSelector } from 'reselect'
import { Record } from 'immutable'
import prefix from '../prefix'
import createAction from '../../../misc/createAction'
import moduleSelector from '../selector'

// Actions

export const TOGGLE_LABEL_EDITOR = prefix('TOGGLE_LABEL_EDITOR');
export function toggleLabelEditor(enabled) {
  return createAction(TOGGLE_LABEL_EDITOR, { enabled });
}

export const EDIT_RESOURCE_LABEL = prefix('EDIT_RESOURCE_LABEL');
export function editResourceLabel(resourceUri) {
  return createAction(EDIT_RESOURCE_LABEL, { resourceUri });
}

// Reducer

const initialState = new (Record({
  enabled: false,
  resourceUri: ''
}));

export default function labelEditorReducer(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_LABEL_EDITOR:
    case EDIT_RESOURCE_LABEL:
      return state.merge(action.payload);
  }

  return state;
}

// Selectors

export const labelEditorSelector = createSelector(
  [moduleSelector],
  parentState => parentState.labelEditor
);

export const labelEditorEnabledSelector = createSelector(
  [labelEditorSelector],
  labelEditor => labelEditor.enabled
);

export const labelEditorResourceUriSelector = createSelector(
  [labelEditorSelector],
  labelEditor => labelEditor.resourceUri
);