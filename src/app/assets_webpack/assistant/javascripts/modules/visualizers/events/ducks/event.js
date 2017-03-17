import createAction from '../../../../misc/createAction'
import withApplicationId from '../../../app/misc/withApplicationId'
import prefix from '../prefix'
import * as api from '../api'
import { GET_APPLICATION_START } from '../../../app/ducks/application'
import { Event } from '../models'

import { createSelector } from 'reselect'
import { createPromiseStatusSelector } from '../../../core/ducks/promises'
import moduleSelector from '../selector'

// Actions

export const GET_EVENT = prefix('GET_GRAPH');
export const GET_EVENT_START = GET_EVENT + '_START';
export const GET_EVENT_ERROR = GET_EVENT + '_ERROR';
export const GET_EVENT_SUCCESS = GET_EVENT + '_SUCCESS';
export const GET_EVENT_RESET = GET_EVENT + '_RESET';

export function getEvent() {
    return withApplicationId(id => {
        const promise = api.getEvent(id);
        return createAction(GET_EVENT, { promise });
    })
}

export function getEventReset() {
    return createAction(GET_EVENT_RESET);
}

// Reducer

const initialState = new Event();

export default function eventReducer(state = initialState, action) {
    switch (action.type) {
        case GET_APPLICATION_START:
        case GET_EVENT_RESET:
            return initialState;
        case GET_EVENT_SUCCESS:
            return new Event(action.payload);
    }

    return state;
};

// Selectors

export const eventStatusSelector = createPromiseStatusSelector(GET_EVENT);
export const eventSelector = createSelector([moduleSelector], state => state.event);