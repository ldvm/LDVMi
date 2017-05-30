import createAction from "../../../../misc/createAction";
import prefix from "../prefix";
import {GET_APPLICATION_START} from "../../../app/ducks/application";
import {createSelector} from "reselect";
import {Set as ImmutableSet} from "immutable";
import moduleSelector from "../selector";

// Actions
export const SET_SELECT_CSL = prefix('SET_SELECT_CONNECTIONS_SECOND');
export const SET_SELECTED_CSL_RESET = SET_SELECT_CSL + "_RESET";

export function setSelectConnSL(key) {
    return createAction(SET_SELECT_CSL, {key});
}

export function setSelectedConnSLReset() {
    return createAction(SET_SELECTED_CSL_RESET);
}

// Reducer
const initialState = new ImmutableSet();
export default function selectedConnSLReducer(state = initialState, action) {
    switch (action.type) {
        case GET_APPLICATION_START:
            return initialState;
        case SET_SELECTED_CSL_RESET:
            return initialState;
        case SET_SELECT_CSL:
            return state.contains(action.payload.key) ? state.remove(action.payload.key) : state.add(action.payload.key);
    }
    return state;
};

// Selectors
export const selectedConnSLSelector = createSelector([moduleSelector], state => state.selectedConnSL);