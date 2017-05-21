import createAction from "../../../../misc/createAction";
import prefix from "../prefix";
import {GET_APPLICATION_START} from "../../../app/ducks/application";
import {createSelector} from "reselect";
import moduleSelector from "../selector";

import {TimeRange} from "../models";

// Actions
export const SET_SELECT_TIME = prefix('SET_SELECT_TIME');
export const GET_SELECT_TIME_RESET = prefix("GET_SELECT_TIME_RESET");

export function setSelectTime(begin, end) {
    return createAction(SET_SELECT_TIME, {begin, end});
}

export function getSelectedTimeReset() {
    return createAction(GET_SELECT_TIME_RESET);
}

// Reducer
const initialState = new TimeRange();
export default function timeRangeReducer(state = initialState, action) {
    switch (action.type) {
        case GET_APPLICATION_START:
            return initialState;
        case GET_SELECT_TIME_RESET:
            return initialState;
        case SET_SELECT_TIME:
            return new TimeRange(action.payload);
    }
    return state;
};

// Selectors
export const timeRangeSelector = createSelector([moduleSelector], state => state.timeRange);
