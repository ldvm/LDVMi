import { createSelector } from 'reselect'
import { Set } from 'immutable'
import prefix from '../prefix'
import createAction from '../../../../misc/createAction'
import moduleSelector from '../selector'

// Actions

export const TOGGLE_MARKER = prefix('TOGGLE_MARKER');

export function toggleMarker(uri) {
  return createAction(TOGGLE_MARKER, { uri });
}

// Reducer

export default function toggledMarkers(state = new Set(), action) {
  if (action.type == TOGGLE_MARKER) {
    const { uri } = action.payload;
    return state.contains(uri) ? state.remove(uri) : state.add(uri);
  }

  return state;
};

// Selectors

export const toggledMarkersSelector = createSelector([moduleSelector], state => state.toggledMarkers);
