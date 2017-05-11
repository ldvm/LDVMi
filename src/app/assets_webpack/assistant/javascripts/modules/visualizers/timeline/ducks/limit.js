import createAction from '../../../../misc/createAction'
import prefix from '../prefix'
import moduleSelector from '../selector'
import { GET_APPLICATION_START } from '../../../app/ducks/application'
import { createSelector } from 'reselect'

export const limit_default = 20;

// Actions
export const SET_LIMIT = prefix('SET_LIMIT');
export const GET_LIMIT_RESET = prefix("GET_LIMIT_RESET");

export function setLimit(limit){
    return createAction(SET_LIMIT,{ limit });
}

export function getLimitReset() {
    return createAction(GET_LIMIT_RESET);
}

// Reducer
const initialState = limit_default;
export default function limitReducer(state = initialState, action) {
    switch (action.type) {
        case GET_APPLICATION_START:
            return initialState;
        case GET_LIMIT_RESET:
            return initialState;
        case SET_LIMIT:
            return action.payload.limit;
    }
    return state;
};

// Selectors
export const limitSelector = createSelector([moduleSelector], state => state.limit);