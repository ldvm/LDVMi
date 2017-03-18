import { combineReducers } from 'redux';
import googleMaps from './googleMaps/reducer'
import chord from './chord/reducer'
import events from './events/reducer'

const rootReducer = combineReducers({
    googleMaps,
    chord,
    events
});
export default rootReducer;