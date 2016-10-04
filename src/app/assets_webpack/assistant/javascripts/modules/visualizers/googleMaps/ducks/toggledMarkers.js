import { createSelector } from 'reselect'
import { Set } from 'immutable'
import prefix from '../prefix'
import createAction from '../../../../misc/createAction'
import moduleSelector from '../selector'
import { GET_APPLICATION_START } from '../../../app/ducks/application'

// Actions

export const TOGGLE_MARKER = prefix('TOGGLE_MARKER');

export function toggleMarker(uri) {
  return createAction(TOGGLE_MARKER, { uri });
}

// Reducer

const initialState = new Set();

export default function toggledMarkers(state = initialState, action) {
  switch (action.type) {
    case GET_APPLICATION_START:
      return initialState;

    case TOGGLE_MARKER:
      const { uri } = action.payload;
      return state.contains(uri) ? state.remove(uri) : state.add(uri);
  }

  return state;
};

// Selectors

export const toggledMarkersSelector = createSelector([moduleSelector], state => state.toggledMarkers);
