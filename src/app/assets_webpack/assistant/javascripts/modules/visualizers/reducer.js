import { combineReducers } from 'redux'
import googleMaps from './googleMaps/reducer'
import chord from './chord/reducer'
import timeline from './timeline/reducer'

const rootReducer = combineReducers({
  googleMaps,
  chord,
  timeline
});
export default rootReducer;