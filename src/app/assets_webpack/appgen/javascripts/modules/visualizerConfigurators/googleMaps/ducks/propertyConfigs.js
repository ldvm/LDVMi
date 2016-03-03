import { Map } from 'immutable'
import prefix from '../prefix'
import createAction from '../../../../misc/createAction'
import { PropertyConfig } from '../models'
import { propertyConfigsSelector as reducerSelector } from '../selector'

// Reducer that maintains the configuration of the whole properties.

// Enum definition

export const types = {
  CHECKBOX: 'CHECKBOX',
  RADIO: 'RADIO'
};

// Actions

export const CONFIGURE_PROPERTY = prefix('CONFIGURE_PROPERTY');

export function configureProperty(propertyUri, settings) {
  return createAction(CONFIGURE_PROPERTY, { propertyUri, settings });
}

// Reducer

const initialState = new Map();

export default function propertyConfigsReducer(state = initialState, action) {
  switch (action.type) {
    case CONFIGURE_PROPERTY:
      const { propertyUri, settings } = action.payload;
      return state.update(propertyUri, config => (config || new PropertyConfig()).merge(settings));
  }

  return state;
};

// Selectors

export const propertyConfigsSelector = reducerSelector;
