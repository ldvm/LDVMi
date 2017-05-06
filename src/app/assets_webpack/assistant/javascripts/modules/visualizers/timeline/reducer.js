import { combineReducers } from 'redux'
import instants from './ducks/instants'
import intervals from './ducks/intervals'

const rootReducer = combineReducers({
    instants,
    intervals,
});

export default rootReducer;