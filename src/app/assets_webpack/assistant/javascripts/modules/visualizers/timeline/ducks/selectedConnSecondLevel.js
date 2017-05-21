import createAction from "../../../../misc/createAction";
import prefix from "../prefix";
import {GET_APPLICATION_START} from "../../../app/ducks/application";
import {createSelector} from "reselect";
import {appendKey, removeKey} from "./utils";
import moduleSelector from "../selector";

// Actions
export const SET_SELECT_CSL = prefix('SET_SELECT_CONNECTIONS_SECOND');
export const SET_UNSELECT_CSL = prefix('SET_UNSELECT_CONNECTIONS_SECOND');
export const GET_SELECTED_CSL_RESET = prefix("GET_SELECTED_CONNECTIONS_SECOND_RESET");

export function setSelectConnSL(key) {
    return createAction(SET_SELECT_CSL, {key});
}

export function setUnSelectConnSL(key) {
    return createAction(SET_UNSELECT_CSL, {key});
}

export function getSelectedConnSLReset() {
    return createAction(GET_SELECTED_CSL_RESET);
}

// Reducer
const initialState = [];
export default function selectedConnSLReducer(state = initialState, action) {
    switch (action.type) {
        case GET_APPLICATION_START:
            return initialState;
        case GET_SELECTED_CSL_RESET:
            return initialState;
        case SET_SELECT_CSL:
            return appendKey(state, action.payload.key);
        case SET_UNSELECT_CSL:
            return removeKey(state, action.payload.key);
    }
    return state;
};

// Selectors
export const selectedConnSLSelector = createSelector([moduleSelector], state => state.selectedConnSL);