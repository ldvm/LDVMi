import { combineReducers } from 'redux';
import events from './ducks/events'
import people from './ducks/people'
import selectedEvents from './ducks/selectedEvents'

const rootReducer = combineReducers({
    events,
    people,
    selectedEvents
});

export default rootReducer;