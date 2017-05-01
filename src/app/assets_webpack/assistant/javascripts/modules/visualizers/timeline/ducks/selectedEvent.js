import { createSelector } from 'reselect'
import prefix from '../prefix'
import createAction from '../../../../misc/createAction'
import moduleSelector from '../selector'
import { GET_APPLICATION_START } from '../../../app/ducks/application'
import {SelectedEvent} from "../models";
import {GET_CONFIGURATION_SUCCESS} from "./configuration";

// Actions
export const SET_SELECTED_EVENT = prefix('SET_SELECTED_EVENT');
export function selectEvent(selectedEvent) {
    return createAction(SET_SELECTED_EVENT, { selectedEvent });
}
export const GET_SELECTED_EVENT = prefix('GET_SELECTED_EVENT');
export function getSelectedEvent() {
    return createAction(GET_SELECTED_EVENT)
}

export const GET_SELECTED_EVENT_RESET = GET_SELECTED_EVENT + "RESET";
export function getSelectedEventReset(){
    return createAction(GET_SELECTED_EVENT_RESET);
}

// Reducer
const initialState = new SelectedEvent();
export default function selectedEventReducer(state = initialState, action) {
    switch (action.type) {
        case GET_APPLICATION_START:
            return initialState;
        case GET_SELECTED_EVENT_RESET:
            return initialState;
        case GET_SELECTED_EVENT:
            return new SelectedEvent(state);
        case GET_CONFIGURATION_SUCCESS:
            if ("selectedEvent" in action.payload) return new SelectedEvent(action.payload.selectedEvent);
            else return state;
        case SET_SELECTED_EVENT:
            return new SelectedEvent({isValid: true, event: action.payload.selectedEvent});
        default:
            return state;
    }
}

// Selectors
export const selectedEventSelector = createSelector([moduleSelector],state => state.selectedEvent);
