import createAction from "../../../../misc/createAction";
import withApplicationId from "../../../app/misc/withApplicationId";
import prefix from "../prefix";
import {GET_APPLICATION_START} from "../../../app/ducks/application";
import {createSelector} from "reselect";
import {Set as ImmutableSet} from "immutable";
import moduleSelector from "../selector";

// Actions
export const SET_SELECT_QUANTIFIED_THINGS = prefix('SET_SELECT_QUANTIFIED_THINGS');
export const SET_SELECT_QUANTIFIED_THINGS_RESET = SET_SELECT_QUANTIFIED_THINGS + '_RESET';

export function setSelectQuantifiedThing(url) {
    return withApplicationId(id => {
        return createAction(SET_SELECT_QUANTIFIED_THINGS, {url});
    });
}

export function setSelectedQuantifiedThingsReset() {
    return createAction(SET_SELECT_QUANTIFIED_THINGS_RESET);
}

// Reducer
const initialState = new ImmutableSet();
export default function selectedQuantifiedThingsReducer(state = initialState, action) {
    switch (action.type) {
        case GET_APPLICATION_START:
            return initialState;
        case SET_SELECT_QUANTIFIED_THINGS_RESET:
            return initialState;
        case SET_SELECT_QUANTIFIED_THINGS:
            return state.contains(action.payload.url) ? state.remove(action.payload.url) : state.add(action.payload.url);
    }
    return state;
};

// Selectors
export const selectedQuantifiedThingsSelector = createSelector([moduleSelector], state => state.selectedQuantifiedThings);