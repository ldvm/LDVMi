import { createSelector } from 'reselect'
import moduleSelector from '../selector'
import { createDirtyReducer } from '../../../manageApp/ducks/dirty'
import { ADD_LIST, REMOVE_LIST, UPDATE_LIST, ADD_TO_LIST, ADD_WITH_RELATED_TO_LIST_SUCCESS, REMOVE_FROM_LIST, REMOVE_WITH_RELATED_FROM_LIST_SUCCESS, SELECT_NODE } from './lists'
import { SELECT_LIST } from './selectedList'
import { UPDATE_PUBLISH_SETTINGS } from './publishSettings'

// Reducer

const actions = [
  ADD_LIST,
  REMOVE_LIST,
  UPDATE_LIST,
  ADD_TO_LIST,
  ADD_WITH_RELATED_TO_LIST_SUCCESS,
  REMOVE_FROM_LIST,
  REMOVE_WITH_RELATED_FROM_LIST_SUCCESS,
  SELECT_NODE,
  SELECT_LIST,
  UPDATE_PUBLISH_SETTINGS
];

export default createDirtyReducer(actions);

// Selectors

export const dirtySelector = createSelector([moduleSelector], state => state.dirty);
