import createAction from '../../../../misc/createAction'
import prefix from '../prefix'
import { GET_APPLICATION_START } from '../../../app/ducks/application'
import { Settings } from '../models'
import { createSelector } from 'reselect'
import moduleSelector from '../selector'
import {GET_CONFIGURATION_SUCCESS} from "./configuration";

// Actions
export const GET_SETTINGS = prefix('GET_SETTINGS');
export const SET_SETTINGS = prefix('SET_SETTINGS');
export const GET_SETTINGS_RESET = GET_SETTINGS + '_RESET';

export function getSettings() {
    return createAction(GET_SETTINGS);
}
export function setSettings(settings) {
    return createAction(SET_SETTINGS, {settings})
}
export function getSettingsReset() {
    return createAction(GET_SETTINGS_RESET);
}

// Reducer
const initialState = new Settings();
export default function configReducer(state = initialState, action) {
    switch (action.type) {
        case GET_APPLICATION_START:
            return initialState;
        case GET_SETTINGS_RESET:
            return initialState;
        case SET_SETTINGS:
            return new Settings(action.payload.settings);
        case GET_CONFIGURATION_SUCCESS:
            return parseSavedSettings(action.payload);
        case GET_SETTINGS:
            return new Settings(state);
        default:
            return state;
    }
};

function parseSavedSettings(payload){
    if ("settings" in payload) {
        var start = new Date(payload.settings.start);
        var end = new Date(payload.settings.end);
        var limit = payload.settings.limit;
        return new Settings({start: start, end: end, limit: limit});
    }
    else return initialState;
}

// Selectors
export const settingsSelector = createSelector([moduleSelector], state => state.settings);

