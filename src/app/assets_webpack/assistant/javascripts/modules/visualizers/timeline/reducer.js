import {combineReducers} from "redux";
import instants from "./ducks/instants";
import intervals from "./ducks/intervals";
import firstLevel from "./ducks/firstLevel";
import secondLevel from "./ducks/secondLevel";
import selectedTimeRecord from "./ducks/selectedTimeRecord";
import selectedTypeFL from "./ducks/selectedTypeFirstLevel";
import selectedThingSL from "./ducks/selectedThingSecondLevel";
import selectedFirstLevelPredicates from "./ducks/selectedFirstLevelPredicates";
import selectedSecondLevelPredicates from "./ducks/selectedSecondLevelPredicates";
import timeRange from "./ducks/timeRange";
import count from "./ducks/count";

const rootReducer = combineReducers({
    instants,
    intervals,
    firstLevel,
    secondLevel,
    selectedTimeRecord,
    selectedTypeFL,
    selectedFirstLevelPredicates,
    selectedThingSL,
    selectedSecondLevelPredicates,
    timeRange,
    count
});

export default rootReducer;