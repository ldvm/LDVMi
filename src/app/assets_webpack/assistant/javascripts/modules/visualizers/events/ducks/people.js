import createAction from '../../../../misc/createAction'
import withApplicationId from '../../../app/misc/withApplicationId'
import prefix from '../prefix'
import * as api from '../api'
import { GET_APPLICATION_START } from '../../../app/ducks/application'
import { PersonInfo } from '../models'
import { createSelector } from 'reselect'
import { createPromiseStatusSelector } from '../../../core/ducks/promises'
import moduleSelector from '../selector'

// Actions
export const GET_PEOPLE = prefix('GET_PEOPLE');
export const GET_PEOPLE_START = GET_PEOPLE + '_START';
export const GET_PEOPLE_ERROR = GET_PEOPLE + '_ERROR';
export const GET_PEOPLE_SUCCESS = GET_PEOPLE + '_SUCCESS';
export const GET_PEOPLE_RESET = GET_PEOPLE + '_RESET';

export function getEventPeople(event) {
    return withApplicationId(id => {
        const promise = api.getEventPeople(id,event);
        return createAction(GET_PEOPLE, { promise });
    });
}

export function getEventPeopleReset() {
    return createAction(GET_PEOPLE_RESET);
}

// Reducer
const initialState = [];
export default function peopleReducer(state = initialState, action) {
    switch (action.type) {
        case GET_APPLICATION_START:
        case GET_PEOPLE_RESET:
            return initialState;
        case GET_PEOPLE_SUCCESS:
            return action.payload.map(ev=>new PersonInfo(ev));
    }
    return state;
};

// Selectors
export const peopleStatusSelector = createPromiseStatusSelector(GET_PEOPLE);
export const peopleSelector = createSelector([moduleSelector], state => state.events);