import { createSelector } from 'reselect'
import prefix from '../prefix'
import createAction from '../../../../misc/createAction'
import moduleSelector from '../selector'
import { GET_APPLICATION_START } from '../../../app/ducks/application'
import { GET_CONFIGURATION_SUCCESS } from './configuration'

// Actions

export const SELECT_EVENT = prefix('SELECT_EVENT');
export function selectEvent(event) {
    return createAction(SELECT_EVENT, { event });
}

// Reducer
const initialState = null;
export default function selectedListReducer(state = initialState, action) {
    switch (action.type) {
        case GET_APPLICATION_START:
            return initialState;
        case GET_CONFIGURATION_SUCCESS:
            if ("configuration" in action.payload) {
                return action.payload.configuration.selectedEvent;
            }
        case SELECT_EVENT:
            return action.payload.event;
    }
    return state;
}

// Selectors
export const selectedEventSelector = createSelector([moduleSelector],state => state.selectedEvent);
