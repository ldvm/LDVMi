import { createSelector } from 'reselect'
import prefix from '../prefix'
import createAction from '../../../misc/createAction'
import moduleSelector from '../selector'
import { DataSource } from '../../createApp/models'

// Actions

export const EDIT_DATA_SOURCE = prefix('EDIT_DATA_SOURCE');
export function editDataSource(id) {
  return createAction(EDIT_DATA_SOURCE, { id });
}

// Reducers

export default function editDataSourceReducer(state = 0, action) {
  if (action.type == EDIT_DATA_SOURCE) {
    return action.payload.id;
  }
  return state;
}

// Selectors

export const dataSourceToEditSelector = createSelector(
  [moduleSelector],
  parentState => parentState.dataSources.entities.get(parentState.editDataSource) || new DataSource()
);

