import { Map } from 'immutable'
import createAction from '../misc/createAction'

export const DIALOG_OPEN = "DIALOG_OPEN";
export const DIALOG_CLOSE = "DIALOG_CLOSE";

export function dialogOpen(name) {
  return createAction(DIALOG_OPEN, {name});
}

export function dialogClose(name) {
  return createAction(DIALOG_CLOSE, {name});
}

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