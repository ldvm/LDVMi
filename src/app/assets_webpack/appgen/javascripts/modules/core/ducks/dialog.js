import { Map } from 'immutable'
import { createSelector } from 'reselect'
import createAction from '../../../misc/createAction'
import prefix from '../prefix'
import moduleSelector from '../selector'

// Actions

export const DIALOG_OPEN = prefix("DIALOG_OPEN");
export const DIALOG_CLOSE = prefix("DIALOG_CLOSE");

export function dialogOpen(name) {
  return createAction(DIALOG_OPEN, { name });
}

export function dialogClose(name) {
  return createAction(DIALOG_CLOSE, { name });
}

// Reducer

const initialState = new Map();

export default function dialogReducer(state = initialState, action) {

  switch (action.type) {
    case DIALOG_OPEN:
      return state.set(action.payload.name, true);

    case DIALOG_CLOSE:
      return state.set(action.payload.name, false);
  }

  return state;
};

// Selectors

export const dialogSelector = createSelector([moduleSelector], state => state.dialog);
