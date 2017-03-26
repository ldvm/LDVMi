import { combineReducers } from 'redux';
import events from './ducks/events'
import people from './ducks/people'

const rootReducer = combineReducers({
    events,
    people
});

export default rootReducer;