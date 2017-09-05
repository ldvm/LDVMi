import { fromJS, List } from 'immutable'
import { arrayToObject } from '../../../../misc/utils'
import prefix from '../prefix'
import { createPromiseStatusSelector } from '../../../core/ducks/promises'
import { Property } from '../models'
import { GET_APPLICATION_START } from '../../../app/ducks/application'

// Actions

export const GET_PROPERTIES = prefix('GET_PROPERTIES');
export const GET_PROPERTIES_START = GET_PROPERTIES + '_START';
export const GET_PROPERTIES_ERROR = GET_PROPERTIES + '_ERROR';
export const GET_PROPERTIES_SUCCESS = GET_PROPERTIES + '_SUCCESS';

// Reducer

const initialState = new List();

export default function propertiesReducer(state = initialState, action) {
  switch (action.type) {
    case GET_APPLICATION_START:
      return initialState;

    case GET_PROPERTIES_SUCCESS:
      const asObject = arrayToObject(action.payload, property => property.uri);
      return fromJS(asObject).map(property => new Property(property));
  }

  return state;
};

// Selectors

export const propertiesStatusSelector = createPromiseStatusSelector(GET_PROPERTIES);
