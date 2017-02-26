import { combineReducers } from 'redux';
import googleMaps from './googleMaps/reducer'
import chord from './chord/reducer'
import eventTimeline from './eventTimeline/reducer'

const rootReducer = combineReducers({
    googleMaps,
    chord,
    eventTimeline
});
export default rootReducer;