import createAction from '../../../../misc/createAction'
import prefix from '../prefix'
import { GET_APPLICATION_START } from '../../../app/ducks/application'
import { createSelector } from 'reselect'
import {appendKey, removeKey} from './utils'
import moduleSelector from '../selector'

// Actions
export const SET_SELECT_CFL = prefix('SET_SELECT_CONNECTIONS_FIRST');
export const SET_UNSELECT_CFL = prefix('SET_UNSELECT_CONNECTIONS_FIRST');
export const GET_SELECTED_CFL_RESET = prefix("GET_SELECTED_CONNECTIONS_FIRST_RESET");



export function setSelectConnFL(key) {
    return createAction(SET_SELECT_CFL, { key });
}

export function setUnSelectConnFL(key){
    return createAction(SET_UNSELECT_CFL,{ key });
}

export function getSelectedConnFLReset() {
    return createAction(GET_SELECTED_CFL_RESET);
}

// Reducer
const initialState = [];
export default function selectedConnFLReducer(state = initialState, action) {
    switch (action.type) {
        case GET_APPLICATION_START:
            return initialState;
        case GET_SELECTED_CFL_RESET:
            return initialState;
        case SET_SELECT_CFL:
            return appendKey(state,action.payload.key);
        case SET_UNSELECT_CFL:
            return removeKey(state,action.payload.key);
    }
    return state;
};

// Selectors
export const selectedConnFLSelector = createSelector([moduleSelector], state => state.selectedConnFL);