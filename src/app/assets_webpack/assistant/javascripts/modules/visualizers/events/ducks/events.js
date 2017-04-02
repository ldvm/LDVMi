import createAction from '../../../../misc/createAction'
import withApplicationId from '../../../app/misc/withApplicationId'
import prefix from '../prefix'
import * as api from '../api'
import { GET_APPLICATION_START } from '../../../app/ducks/application'
import { EventInfo } from '../models'
import { createSelector } from 'reselect'
import { createPromiseStatusSelector } from '../../../core/ducks/promises'
import moduleSelector from '../selector'

// Actions
export const GET_EVENTS = prefix('GET_EVENTS');
export const GET_EVENTS_START = GET_EVENTS + '_START';
export const GET_EVENTS_ERROR = GET_EVENTS + '_ERROR';
export const GET_EVENTS_SUCCESS = GET_EVENTS + '_SUCCESS';
export const GET_EVENTS_RESET = GET_EVENTS + '_RESET';

export function getEvents(config) {
    return withApplicationId(id => {
        const promise = api.getEvents(id,config);
        return createAction(GET_EVENTS, { promise });
    });
}

export function getEventsReset() {
    return createAction(GET_EVENTS_RESET);
}

// Reducer
const initialState = [];
export default function eventsReducer(state = initialState, action) {
    switch (action.type) {
        case GET_APPLICATION_START:
            return initialState;
        case GET_EVENTS_RESET:
            return initialState;
        case GET_EVENTS_ERROR:
            return initialState;
        case GET_EVENTS_SUCCESS:
            return action.payload.map(ev=>new EventInfo(ev));
    }
    return state;
};

// Selectors
export const eventsStatusSelector = createPromiseStatusSelector(GET_EVENTS);
export const eventsSelector = createSelector([moduleSelector], state => state.events);