import { createSelector } from 'reselect'
import prefix from '../prefix'
import createAction from '../../../../misc/createAction'
import { PublishSettings } from '../models'
import moduleSelector from '../selector'
import { GET_CONFIGURATION_SUCCESS } from './configuration'
import { GET_APPLICATION_START } from '../../../app/ducks/application'

// Actions

export const UPDATE_PUBLISH_SETTINGS = prefix('UPDATE_PUBLISH_SETTINGS');

export function updatePublishSettings(update) {
  return createAction(UPDATE_PUBLISH_SETTINGS, { update });
}

// Reducers

const initialState = PublishSettings();

export default function publishSettingsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_APPLICATION_START:
      return initialState;

    case GET_CONFIGURATION_SUCCESS:
      if ('publishSettings' in action.payload) {
        return initialState.mergeDeep(action.payload.publishSettings);
      }
      break;

    case UPDATE_PUBLISH_SETTINGS:
      return state.mergeDeep(action.payload.update);
  }

  return state;
}

// Selectors

export const publishSettingsSelector = createSelector([moduleSelector], state => state.publishSettings);
