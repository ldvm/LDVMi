import { combineReducers } from 'redux';
import events from './ducks/events'
import people from './ducks/people'
import selectedEvent from './ducks/selectedEvent'
import config from './ducks/configuration'

const rootReducer = combineReducers({
    events,
    people,
    selectedEvent,
    config
});

export default rootReducer;