import { combineReducers } from 'redux';
import events from './ducks/events'
import people from './ducks/people'
import selectedEvent from './ducks/selectedEvent'
import settings from './ducks/settings'
import dirty from './ducks/dirty'

const rootReducer = combineReducers({
    events,
    people,
    selectedEvent,
    settings,
    dirty
});

export default rootReducer;