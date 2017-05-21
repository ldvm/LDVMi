import createAction from "../../../../misc/createAction";
import prefix from "../prefix";
import {GET_APPLICATION_START} from "../../../app/ducks/application";
import {createSelector} from "reselect";
import moduleSelector from "../selector";

// Actions
export const SET_SELECT_TIME_RECORD = prefix('SET_SELECT_TIME_RECORD');
export const GET_SELECTED_TIME_RECORD_RESET = prefix("GET_SELECTED_TIME_RECORD_RESET");

export function setSelectTimeRecord(rec) {
    return createAction(SET_SELECT_TIME_RECORD, {rec});
}

export function getSelectTimeRecordReset() {
    return createAction(GET_SELECTED_TIME_RECORD_RESET);
}

// Reducer
const initialState = [];
export default function selectedTRReducer(state = initialState, action) {
    switch (action.type) {
        case GET_APPLICATION_START:
            return initialState;
        case GET_SELECTED_TIME_RECORD_RESET:
            return initialState;
        case SET_SELECT_TIME_RECORD:
            return [action.payload.rec];
    }
    return state;
};

// Selectors
export const selectedTimeRecordSelector = createSelector([moduleSelector], state => state.selectedTimeRecord);
