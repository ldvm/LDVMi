import { combineReducers } from 'redux';
import events from './ducks/events'
import people from './ducks/people'
import selectedEvents from './ducks/selectedEvents'
import config from './ducks/configuration'

const rootReducer = combineReducers({
    events,
    people,
    selectedEvents,
    config
});

export default rootReducer;