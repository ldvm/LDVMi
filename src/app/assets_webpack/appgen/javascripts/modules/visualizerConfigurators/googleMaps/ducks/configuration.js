import { createSelector } from 'reselect'
import prefix from '../prefix'
import moduleSelector from '../selector'
import createAction from '../../../../misc/createAction'
import { notification } from '../../../core/ducks/notifications'
import * as api from '../../../manageApp/api'
import { applicationSelector } from '../../../manageApp/ducks/application'
import { createPromiseStatusSelector } from '../../../core/ducks/promises'

// Actions

export const SAVE_CONFIGURATION = prefix('SAVE_CONFIGURATION');
export const SAVE_CONFIGURATION_START = SAVE_CONFIGURATION + '_START';
export const SAVE_CONFIGURATION_ERROR = SAVE_CONFIGURATION + '_ERROR';
export const SAVE_CONFIGURATION_SUCCESS = SAVE_CONFIGURATION + '_SUCCESS';

export const GET_CONFIGURATION = prefix('GET_CONFIGURATION');
export const GET_CONFIGURATION_START = GET_CONFIGURATION + '_START';
export const GET_CONFIGURATION_ERROR = GET_CONFIGURATION + '_ERROR';
export const GET_CONFIGURATION_SUCCESS = GET_CONFIGURATION + '_SUCCESS';

export function saveConfiguration() {
  return (dispatch, getState) => {
    const appId = applicationSelector(getState()).id;
    const configuration = configurationSelector(getState());

    const promise = api.saveConfiguration(appId, configuration)
      .then(response => dispatch(notification(response.message)))
      .catch(e => {
        dispatch(notification('Saving the configuration failed.'));
        throw e;
      });
    dispatch(createAction(SAVE_CONFIGURATION, { promise }));
  }
}

export function getConfiguration() {
  return (dispatch, getState) => {
    const appId = applicationSelector(getState()).id;

    const promise = api.getConfiguration(appId)
      .catch(e => {
        dispatch(notification('Loading the configuration failed.'));
        throw e;
      });
    dispatch(createAction(GET_CONFIGURATION, { promise }));
  }
}

// Selectors

export const configurationStatusSelector = createPromiseStatusSelector(SAVE_CONFIGURATION);

export const configurationSelector = createSelector(
  [moduleSelector],
  state => ({
    filtersConfig: state.filters.filtersConfig.toJS(),
    optionsConfig: state.filters.optionsConfig.toJS(),
    mapState: state.mapState.toJS(),
    publishSettings: state.publishSettings.toJS()
  })
);
