import { Map, List, fromJS } from 'immutable'
import prefix from '../prefix'
import createAction from '../../../../misc/createAction'
import { Filter, Option } from '../models'

// Actions

export const CONFIGURE_FILTER = prefix('CONFIGURE_FILTER');

export function configureFilter(propertyUri, settings) {
  const update = fromJS({ [propertyUri]: settings });
  return createAction(CONFIGURE_FILTER, { propertyUri, update });
}

// Reducer

export default function filtersConfigReducer(state = new Map(), action) {
  switch (action.type) {
    case CONFIGURE_FILTER:
      return state.mergeDeep(action.payload.update);
  }

  return state;
};

