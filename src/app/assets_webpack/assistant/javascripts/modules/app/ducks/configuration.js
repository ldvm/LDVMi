import { createSelector } from 'reselect'
import * as api from '../api'
import { notification } from '../../core/ducks/notifications'
import { applicationSelector } from './application'
import createAction from '../../../misc/createAction'
import prefix from '../prefix'
import moduleSelector from '../selector'

// Most visualizers need to be able to save and load configuration. Following action factories represent
// shared business logic which is identical for all visualizers. The functionality cannot be shared
// completely: each visualizer needs to define its own actions for saving and loading to avoid
// conflicts between reducers (each reducer needs to be sure that it responds only to actions of
// the visualizer it belongs to). Also each visualizer needs to be able to define its configuration,
// i. e. which data should be part of the configuration (and stored on the server).

// On the other hand, there is functionality (like custom labels) that is part of the configuration
// and is exactly the same for all visualizers. Therefore it makes sense to handle this functionality
// with common reducers (and components/selectors). The common reducers, however, cannot respond to custom
// prefixed actions (SAVE_CONFIGURATION, GET_CONFIGURATION). To make this work and successfully
// "merge custom with common", these actions are always dispatched in two version, one is the
// custom prefixed one, and the other one is universal. Also the common configuration is always
// merged into the custom configuration during the saving process.

// Actions common for all visualizers

export const SAVE_CONFIGURATION_START = prefix('SAVE_CONFIGURATION_START');
export const SAVE_CONFIGURATION_ERROR = prefix('SAVE_CONFIGURATION_ERROR');
export const SAVE_CONFIGURATION_SUCCESS = prefix('SAVE_CONFIGURATION_SUCCESS');

export const GET_CONFIGURATION_START = prefix('GET_CONFIGURATION_START');
export const GET_CONFIGURATION_ERROR = prefix('GET_CONFIGURATION_ERROR');
export const GET_CONFIGURATION_SUCCESS = prefix('GET_CONFIGURATION_SUCCESS');
export const GET_CONFIGURATION_RESET = prefix('GET_CONFIGURATION_RESET');

// Selector for configuration common for all visualizers

const commonConfigurationSelector = createSelector(
  [moduleSelector],
  state => ({
    customLabels: state.customLabels.toJS(),
    limit: state.limit
  })
);

// Custom visualizer-dependent actions

export function createSaveConfiguration(saveAction, visualizerConfigurationSelector) {
  return (id) => {
    return (dispatch, getState) => {
      const appId = id || applicationSelector(getState()).id;

      const configuration = {
        common: commonConfigurationSelector(getState()),
        visualizer: visualizerConfigurationSelector(getState())
      };

      const promise = api.saveConfiguration(appId, configuration)
        .then(response => {
          dispatch(notification(response.message));
          dispatch(createAction(SAVE_CONFIGURATION_SUCCESS));
        })
        .catch(e => {
          dispatch(notification('Saving the configuration failed.'));
          dispatch(createAction(SAVE_CONFIGURATION_ERROR));
          throw e;
        });
      dispatch(createAction(SAVE_CONFIGURATION_START));
      dispatch(createAction(saveAction, { promise }));
    }
  }
}

export function createGetConfiguration(getAction) {
  return (id) => {
    return (dispatch, getState) => {
      const appId = id || applicationSelector(getState()).id;

      const promise = api.getConfiguration(appId)
        .then(configuration => {
          dispatch(createAction(GET_CONFIGURATION_SUCCESS, configuration.common || {}));
          return configuration.visualizer || {};
        })
        .catch(e => {
          dispatch(notification('Loading the configuration failed.'));
          dispatch(createAction(GET_CONFIGURATION_ERROR));
          throw e;
        });
      dispatch(createAction(GET_CONFIGURATION_START));
      dispatch(createAction(getAction, { promise }));
    }
  }
}

export function createGetConfigurationReset(resetAction) {
  return () => dispatch => {
    dispatch(createAction(resetAction));
    dispatch(createAction(GET_CONFIGURATION_RESET));
  }
}
