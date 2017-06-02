import createAction from "../../../../misc/createAction";
import withApplicationId from "../../../app/misc/withApplicationId";
import prefix from "../prefix";
import {GET_APPLICATION_START} from "../../../app/ducks/application";
import {createSelector} from "reselect";
import {Set as ImmutableSet} from "immutable";
import moduleSelector from "../selector";

// Actions
export const SET_SELECT_VALUE_CONNECTIONS = prefix('SET_SELECT_VALUE_CONNECTIONS');
export const SET_SELECT_VALUE_CONNECTIONS_RESET = SET_SELECT_VALUE_CONNECTIONS + '_RESET';

export function setSelectValueConnection(url) {
    return withApplicationId(id => {
        return createAction(SET_SELECT_VALUE_CONNECTIONS, {url});
    });
}

export function setSelectedValueConnectionsReset() {
    return createAction(SET_SELECT_VALUE_CONNECTIONS_RESET);
}

// Reducer
const initialState = new ImmutableSet();
export default function selectedValueConnections(state = initialState, action) {
    switch (action.type) {
        case GET_APPLICATION_START:
            return initialState;
        case SET_SELECT_VALUE_CONNECTIONS_RESET:
            return initialState;
        case SET_SELECT_VALUE_CONNECTIONS:
            return state.contains(action.payload.url) ? state.remove(action.payload.url) : state.add(action.payload.url);
    }
    return state;
};

// Selectors
export const selectedValueConnectionsSelector = createSelector([moduleSelector], state => state.selectedValueConnections);