import * as api from '../api'
import { notification } from '../../core/ducks/notifications'
import { applicationSelector } from './application'
import createAction from '../../../misc/createAction'

// Most visualizers need to be able to save and load configuration. These two factories represent
// shared business logic which is identical for all visualizers. The functionality cannot be shared
// completely: each visualizer needs to define its own actions for saving and loading to avoid
// conflicts between reducers (each reducer needs to be sure that it responds only to actions of
// the visualizer it belongs to). Also each visualizer needs to be able to define its configuration,
// i. e. which data should be part of the configuration (and stored on the server).

export function createSaveConfiguration(saveAction, configurationSelector) {
  return (id) => {
    return (dispatch, getState) => {
      const appId = id || applicationSelector(getState()).id;
      const configuration = configurationSelector(getState());

      const promise = api.saveConfiguration(appId, configuration)
        .then(response => dispatch(notification(response.message)))
        .catch(e => {
          dispatch(notification('Saving the configuration failed.'));
          throw e;
        });
      dispatch(createAction(saveAction, { promise }));
    }
  }
}

export function createGetConfiguration(getAction) {
  return (id) => {
    return (dispatch, getState) => {
      const appId = id || applicationSelector(getState()).id;

      const promise = api.getConfiguration(appId)
        .catch(e => {
          dispatch(notification('Loading the configuration failed.'));
          throw e;
        });
      dispatch(createAction(getAction, { promise }));
    }
  }
}
