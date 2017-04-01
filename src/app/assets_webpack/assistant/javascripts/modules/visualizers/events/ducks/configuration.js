import createAction from '../../../../misc/createAction'
import prefix from '../prefix'
import { GET_APPLICATION_START } from '../../../app/ducks/application'
import { Configuration } from '../models'
import { createSelector } from 'reselect'
import moduleSelector from '../selector'

// Actions
export const GET_CONFIG = prefix('GET_CONFIG');
export const SET_CONFIG = prefix('SET_CONFIG');
export const GET_CONFIG_RESET = GET_CONFIG + '_RESET';

export function getConfiguration() {
    return createAction(GET_CONFIG);
}
export function setConfiguration(config) {
    return createAction(SET_CONFIG, {config})
}
export function getConfigurationReset() {
    return createAction(GET_CONFIG_RESET);
}

// Reducer
const initialState = new Configuration();
export default function configReducer(state = initialState, action) {
    switch (action.type) {
        case GET_APPLICATION_START:
            return initialState;
        case GET_CONFIG_RESET:
            return initialState;
        case SET_CONFIG:
            return Configuration(action.payload.config);
        case GET_CONFIG:
            return new Configuration(state);
        default:
            return state;
    }
};

// Selectors
export const configSelector = createSelector([moduleSelector], state => state.config);

