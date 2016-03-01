import { List, fromJS } from 'immutable'
import prefix from '../prefix'

// Actions

export const GET_PROPERTIES = prefix('GET_PROPERTIES');
export const GET_PROPERTIES_START = GET_PROPERTIES + '_START';
export const GET_PROPERTIES_ERROR = GET_PROPERTIES + '_ERROR';
export const GET_PROPERTIES_SUCCESS = GET_PROPERTIES + '_SUCCESS';

// Reducer

export default function propertiesReducer(state = new List(), action) {
  if (action.type == GET_PROPERTIES_SUCCESS) {
    return fromJS(action.payload);
  }

  return state;
};
