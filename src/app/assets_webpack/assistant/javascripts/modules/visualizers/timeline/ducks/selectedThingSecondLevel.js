import createAction from "../../../../misc/createAction";
import prefix from "../prefix";
import {GET_APPLICATION_START} from "../../../app/ducks/application";
import {createSelector} from "reselect";
import {Set as ImmutableSet} from "immutable";
import moduleSelector from "../selector";

// Actions
export const SET_SELECT_TSL = prefix('SET_SELECT_THING_SECOND');
export const SET_SELECTED_TSL_RESET = SET_SELECT_TSL + "_RESET";

export function setSelectThingSL(key) {
    return createAction(SET_SELECT_TSL, {key});
}

export function setSelectedThingSLReset() {
    return createAction(SET_SELECTED_TSL_RESET);
}

// Reducer
const initialState = new ImmutableSet();
export default function selectedThingSLReducer(state = initialState, action) {
    switch (action.type) {
        case GET_APPLICATION_START:
            return initialState;
        case SET_SELECTED_TSL_RESET:
            return initialState;
        case SET_SELECT_TSL:
            return state.contains(action.payload.key) ? state.remove(action.payload.key) : state.add(action.payload.key);
    }
    return state;
};

// Selectors
export const selectedThingSLSelector = createSelector([moduleSelector], state => state.selectedThingSL);
