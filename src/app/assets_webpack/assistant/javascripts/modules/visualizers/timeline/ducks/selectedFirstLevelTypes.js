import createAction from "../../../../misc/createAction";
import prefix from "../prefix";
import {GET_APPLICATION_START} from "../../../app/ducks/application";
import {createSelector} from "reselect";
import {Set as ImmutableSet} from "immutable";
import moduleSelector from "../selector";

// Actions
export const SET_SELECT_FL_TYPE = prefix('SET_SELECT_FIRST_LEVEL_TYPE');
export const SET_SELECT_FL_TYPE_RESET = SET_SELECT_FL_TYPE + "_RESET";

export function setSelectFirstLevelType(key) {
    return createAction(SET_SELECT_FL_TYPE, {key});
}

export function setSelectedFirstLevelTypesReset() {
    return createAction(SET_SELECT_FL_TYPE_RESET);
}

// Reducer
const initialState = new ImmutableSet();
export default function selectedFirstLevelTypeReducer(state = initialState, action) {
    switch (action.type) {
        case GET_APPLICATION_START:
            return initialState;
        case SET_SELECT_FL_TYPE_RESET:
            return initialState;
        case SET_SELECT_FL_TYPE:
            return state.contains(action.payload.key) ? state.remove(action.payload.key) : state.add(action.payload.key);
    }
    return state;
};

// Selectors
export const selectedFirstLevelTypesSelector = createSelector([moduleSelector], state => state.selectedFirstLevelTypes);
