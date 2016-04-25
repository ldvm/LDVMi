import { combineReducers } from 'redux';
import googleMaps from './googleMaps/reducer'
import chord from './chord/reducer'

const rootReducer = combineReducers({
  googleMaps,
  chord
});
export default rootReducer;