import createAction from "../../../../misc/createAction";
import prefix from "../prefix";
import {GET_APPLICATION_START} from "../../../app/ducks/application";
import {createSelector} from "reselect";
import {Set as ImmutableSet} from "immutable";
import moduleSelector from "../selector";

// Actions
export const SET_SELECT_CFL = prefix('SET_SELECT_CONNECTIONS_FIRST');
export const SET_SELECTED_CFL_RESET = SET_SELECT_CFL + "_RESET";

export function setSelectConnFL(key) {
    return createAction(SET_SELECT_CFL, {key});
}

export function setSelectedConnFLReset() {
    return createAction(SET_SELECTED_CFL_RESET);
}

// Reducer
const initialState = new ImmutableSet();
export default function selectedConnFLReducer(state = initialState, action) {
    switch (action.type) {
        case GET_APPLICATION_START:
            return initialState;
        case SET_SELECTED_CFL_RESET:
            return initialState;
        case SET_SELECT_CFL:
            return state.contains(action.payload.key) ? state.remove(action.payload.key) : state.add(action.payload.key);
    }
    return state;
};

// Selectors
export const selectedConnFLSelector = createSelector([moduleSelector], state => state.selectedConnFL);