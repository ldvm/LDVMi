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
export const GET_QUANTIFIERS = prefix('GET_QUANTIFIERS');
export const GET_QUANTIFIERS_SUCCESS = GET_QUANTIFIERS + '_SUCCESS';
export const GET_QUANTIFIERS_RESET = GET_QUANTIFIERS + '_RESET';

export function getQuantifiers(urls, connections, limit) {
    return withApplicationId(id => {
        const promise = api.getQuantifiers(id, urls, connections, limit);
        return createAction(GET_QUANTIFIERS, {promise});
    });
}

export function getQuantifiersReset() {
    return createAction(GET_QUANTIFIERS_RESET);
}

// Reducer
const initialState = [];
export default function quantifiersReducer(state = initialState, action) {
    switch (action.type) {
        case GET_APPLICATION_START:
            return initialState;
        case GET_QUANTIFIERS_RESET:
            return initialState;
        case GET_QUANTIFIERS_SUCCESS:
            return action.payload.map(i => new Connection(i));
    }
    return state;
};

// Selectors
export const quantifiersStatusSelector = createPromiseStatusSelector(GET_QUANTIFIERS);
export const quantifiersSelector = createSelector([moduleSelector], state => state.quantifiers);