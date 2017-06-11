import {createSelector} from "reselect";
import moduleSelector from "../selector";
import {createDirtyReducer} from "../../../app/ducks/dirty";
import {CONFIGURE_FILTER} from "./filtersConfig";
import {CONFIGURE_ALL_OPTIONS, CONFIGURE_OPTION} from "./optionsConfig";
import {UPDATE_PUBLISH_SETTINGS} from "./publishSettings";
import {UPDATE_MAP_STATE} from "./mapState";
import {SET_SELECT_QUANTIFIED_THINGS} from "./selectedQuantifiedThings";
import {SET_SELECT_PLACE_TYPES} from "./selectedPlaceTypes";
import {SET_SELECT_VALUE_PREDICATES} from "./selectedValuePredicates";
import {SET_SELECT_PLACE_PREDICATES} from "./selectedPlacePredicates";

// Reducer

const actions = [
    CONFIGURE_FILTER,
    CONFIGURE_OPTION,
    CONFIGURE_ALL_OPTIONS,
    UPDATE_PUBLISH_SETTINGS,
    UPDATE_MAP_STATE,

    SET_SELECT_QUANTIFIED_THINGS,
    SET_SELECT_PLACE_TYPES,
    SET_SELECT_PLACE_PREDICATES,
    SET_SELECT_VALUE_PREDICATES
];

export default createDirtyReducer(actions);

// Selectors

export const dirtySelector = createSelector([moduleSelector], state => state.dirty);
