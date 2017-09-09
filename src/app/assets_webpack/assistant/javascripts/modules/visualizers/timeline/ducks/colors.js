import createAction from '../../../../misc/createAction'
import prefix from '../prefix'
import { GET_APPLICATION_START } from '../../../app/ducks/application'
import { createSelector } from 'reselect'
import { Map as ImmutableMap } from 'immutable'
import moduleSelector from '../selector'

// Actions
export const SET_COLORS = prefix('SET_COLORS');
export const SET_COLORS_RESET = SET_COLORS + '_RESET';

export function setColors(colorMap) {
  return createAction(SET_COLORS, { colorMap });
}
export function setColorsReset() {
  return createAction(SET_COLORS_RESET);
}

// Reducer
const initialState = new ImmutableMap();
export default function colorsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_APPLICATION_START:
      return initialState;
    case SET_COLORS_RESET:
      return initialState;
    case SET_COLORS:
      return action.payload.colorMap;
  }
  return state;
};

// Selectors
export const colorsSelector = createSelector([moduleSelector], state => state.colors);
