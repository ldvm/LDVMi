import createAction from "../../../../misc/createAction";
import prefix from "../prefix";
import {GET_APPLICATION_START} from "../../../app/ducks/application";
import {createSelector} from "reselect";
import {appendKey, removeKey} from "./utils";
import moduleSelector from "../selector";

// Actions
export const SET_SELECT_TSL = prefix('SET_SELECT_THING_SECOND');
export const SET_UNSELECT_TSL = prefix('SET_UNSELECT_THING_SECOND');
export const GET_SELECTED_TSL_RESET = prefix("GET_SELECTED_THING_SECOND_RESET");

export function setSelectThingSL(key) {
    return createAction(SET_SELECT_TSL, {key});
}

export function setUnSelectThingSL(key) {
    return createAction(SET_UNSELECT_TSL, {key});
}

export function getSelectedThingSLReset() {
    return createAction(GET_SELECTED_TSL_RESET);
}

// Reducer
const initialState = [];
export default function selectedThingSLReducer(state = initialState, action) {
    switch (action.type) {
        case GET_APPLICATION_START:
            return initialState;
        case GET_SELECTED_TSL_RESET:
            return initialState;
        case SET_SELECT_TSL:
            return appendKey(state, action.payload.key);
        case SET_UNSELECT_TSL:
            return removeKey(state, action.payload.key);
    }
    return state;
};

// Selectors
export const selectedThingSLSelector = createSelector([moduleSelector], state => state.selectedThingSL);
