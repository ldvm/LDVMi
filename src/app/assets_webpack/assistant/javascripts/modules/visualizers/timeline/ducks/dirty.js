import {createSelector} from "reselect";
import moduleSelector from "../selector";
import {createDirtyReducer} from "../../../app/ducks/dirty";
import {SET_SELECT_FL_PREDICATE} from "./selectedFirstLevelPredicates";
import {SET_SELECT_FL_TYPE} from "./selectedFirstLevelTypes";
import {SET_SELECT_SL_PREDICATE} from "./selectedSecondLevelPredicates";
import {SET_SELECT_SL_THING} from "./selectedSecondLevelThings";
import {SET_TIME_RANGE} from "./timeRange";

// Reducer
const actions = [
    SET_SELECT_FL_PREDICATE,
    SET_SELECT_FL_TYPE,
    SET_SELECT_SL_PREDICATE,
    SET_SELECT_SL_THING,
    SET_TIME_RANGE
];

export default createDirtyReducer(actions);

// Selectors
export const dirtySelector = createSelector([moduleSelector], state => state.dirty);
