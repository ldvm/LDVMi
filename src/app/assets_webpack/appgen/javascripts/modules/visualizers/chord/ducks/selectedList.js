import { createSelector } from 'reselect'
import prefix from '../prefix'
import createAction from '../../../../misc/createAction'
import moduleSelector from '../selector'
import { listsSelector, ADD_LIST, REMOVE_LIST } from './lists'

// Actions

export const SELECT_LIST = prefix('SELECT_LIST');
export function selectList(id) {
  return createAction(SELECT_LIST, { id });
}

// Reducer

const initialState = "";

export default function selectedListReducer(state = initialState, action) {

  switch (action.type) {
    case SELECT_LIST:
    case ADD_LIST:
      return action.payload.id;

    case REMOVE_LIST:
      return state == action.payload.id ? initialState : state;
  }

  return state;
}

// Selectors

export const selectedListSelector = createSelector(
  [moduleSelector, listsSelector],
  (parentState, lists) => lists.get(parentState.selectedList)
);
