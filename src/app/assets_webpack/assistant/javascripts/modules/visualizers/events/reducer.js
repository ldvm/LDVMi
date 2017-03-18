import { combineReducers } from 'redux';
import events from './ducks/events'

const rootReducer = combineReducers({
    events
});

export default rootReducer;