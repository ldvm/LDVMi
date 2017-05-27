import createAction from "../../../../misc/createAction";
import withApplicationId from "../../../app/misc/withApplicationId";
import prefix from "../prefix";
import * as api from "../api";
import {GET_APPLICATION_START} from "../../../app/ducks/application";
import {Connection} from "../models";
import {createSelector} from "reselect";
import {createPromiseStatusSelector} from "../../../core/ducks/promises";
import moduleSelector from "../selector";

// Actions
export const GET_TWP = prefix('GET_THINGS_WITH_PLACES');
export const GET_TWP_SUCCESS = GET_TWP + '_SUCCESS';
export const GET_TWP_RESET = GET_TWP + '_RESET';

export function getThingsWithPlaces(urls, types, connections, limit) {
    return withApplicationId(id => {
        const promise = api.getThingsWithPlaces(id, urls, types, connections, limit);
        return createAction(GET_TWP, {promise});
    });
}

export function getThingsWithPlacesReset() {
    return createAction(GET_TWP_RESET);
}

// Reducer
const initialState = [];
export default function thingsWithPlacesReducer(state = initialState, action) {
    switch (action.type) {
        case GET_APPLICATION_START:
            return initialState;
        case GET_TWP_RESET:
            return initialState;
        case GET_TWP_SUCCESS:
            return action.payload.map(i => new Connection(i));
    }
    return state;
};

// Selectors
export const thingsWithPlacesStatusSelector = createPromiseStatusSelector(GET_TWP);
export const thingsWithPlacesSelector = createSelector([moduleSelector], state => state.thingsWithPlaces);