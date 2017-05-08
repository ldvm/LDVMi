import { combineReducers } from 'redux'
import instants from './ducks/instants'
import intervals from './ducks/intervals'
import firstLevel from './ducks/firstLevel'
import secondLevel from './ducks/secondLevel'
import selectedTypeFL from './ducks/selectedTypeFirstLevel'
import selectedThingSL from './ducks/selectedThingSecondLevel'
import selectedConnFL from './ducks/selectedConnFirstLevel'
import selectedConnSL from './ducks/selectedConnSecondLevel'

const rootReducer = combineReducers({
    instants,
    intervals,
    firstLevel,
    secondLevel,
    selectedTypeFL,
    selectedConnFL,
    selectedThingSL,
    selectedConnSL
});

export default rootReducer;