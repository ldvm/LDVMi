import createAction from "../../../../misc/createAction";
import prefix from "../prefix";
import {GET_APPLICATION_START} from "../../../app/ducks/application";
import {createSelector} from "reselect";
import {Set as ImmutableSet} from "immutable";
import moduleSelector from "../selector";

// Actions
export const SET_SELECT_TFL = prefix('SET_SELECT_TYPE_FL');
export const SET_SELECT_TFL_RESET = SET_SELECT_TFL + "_RESET";

export function setSelectTypeFL(key) {
    return createAction(SET_SELECT_TFL, {key});
}

export function setSelectedTypeFLReset() {
    return createAction(SET_SELECT_TFL_RESET);
}

// Reducer
const initialState = new ImmutableSet();
export default function selectedTypeFLReducer(state = initialState, action) {
    switch (action.type) {
        case GET_APPLICATION_START:
            return initialState;
        case SET_SELECT_TFL_RESET:
            return initialState;
        case SET_SELECT_TFL:
            return state.contains(action.payload.key) ? state.remove(action.payload.key) : state.add(action.payload.key);
    }
    return state;
};

// Selectors
export const selectedTypeFLSelector = createSelector([moduleSelector], state => state.selectedTypeFL);
