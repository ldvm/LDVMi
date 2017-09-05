import { fromJS, Map } from 'immutable'
import prefix from '../prefix'
import createAction from '../../../../misc/createAction'
import { GET_CONFIGURATION_SUCCESS } from './configuration'
import { GET_APPLICATION_START } from '../../../app/ducks/application'

// Actions

export const CONFIGURE_FILTER = prefix('CONFIGURE_FILTER');

export function configureFilter(propertyUri, settings) {
  const update = fromJS({ [propertyUri]: settings });
  return createAction(CONFIGURE_FILTER, { propertyUri, update });
}

export const EXPAND_FILTER = prefix('EXPANED_FILTER');

export function expandFilter(propertyUri, expanded) {
  const update = fromJS({ [propertyUri]: { expanded } });
  return createAction(EXPAND_FILTER, { propertyUri, update });
}

// Reducer

const initialState = new Map();

export default function filtersConfigReducer(state = initialState, action) {
  switch (action.type) {
    case GET_APPLICATION_START:
      return initialState;

    case GET_CONFIGURATION_SUCCESS:
      if ("filtersConfig" in action.payload) {
        return initialState.mergeDeep(action.payload.filtersConfig);
      }
      break;

    case CONFIGURE_FILTER:
    case EXPAND_FILTER:
      return state.mergeDeep(action.payload.update);
  }

  return state;
};

