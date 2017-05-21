import createAction from "../../../../misc/createAction";
import prefix from "../prefix";
import {GET_APPLICATION_START} from "../../../app/ducks/application";
import {createSelector} from "reselect";
import {appendKey, removeKey} from "./utils";
import moduleSelector from "../selector";

// Actions
export const SET_SELECT_TFL = prefix('SET_SELECT_TYPE_FL');
export const SET_UNSELECT_TFL = prefix('SET_UNSELECT_TYPE_FL');
export const GET_SELECTED_TFL_RESET = prefix("GET_SELECTED_TYPE_FL_RESET");

export function setSelectTypeFL(key) {
    return createAction(SET_SELECT_TFL, {key});
}

export function setUnSelectTypeFL(key) {
    return createAction(SET_UNSELECT_TFL, {key});
}

export function getSelectedTypeFLReset() {
    return createAction(GET_SELECTED_TFL_RESET);
}

// Reducer
const initialState = [];
export default function selectedTypeFLReducer(state = initialState, action) {
    switch (action.type) {
        case GET_APPLICATION_START:
            return initialState;
        case GET_SELECTED_TFL_RESET:
            return initialState;
        case SET_SELECT_TFL:
            return appendKey(state, action.payload.key);
        case SET_UNSELECT_TFL:
            return removeKey(state, action.payload.key);
    }
    return state;
};

// Selectors
export const selectedTypeFLSelector = createSelector([moduleSelector], state => state.selectedTypeFL);
