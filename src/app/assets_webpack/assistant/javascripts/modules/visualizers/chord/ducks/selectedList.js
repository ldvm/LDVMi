import { createSelector } from 'reselect'
import prefix from '../prefix'
import createAction from '../../../../misc/createAction'
import moduleSelector from '../selector'
import { listsSelector, ADD_LIST, REMOVE_LIST } from './lists'
import { GET_APPLICATION_START } from '../../../app/ducks/application'
import { GET_CONFIGURATION_SUCCESS } from './configuration'

// Actions

export const SELECT_LIST = prefix('SELECT_LIST');
export function selectList(id) {
  return createAction(SELECT_LIST, { id });
}

// Reducer

const initialState = "";

export default function selectedListReducer(state = initialState, action) {

  switch (action.type) {
    case GET_APPLICATION_START:
      return initialState;

    case GET_CONFIGURATION_SUCCESS:
      if ("selectedList" in action.payload) {
        return action.payload.selectedList;
      }
      break;

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
