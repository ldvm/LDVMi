import { combineReducers } from 'redux';
import application from './ducks/application'
import labelEditor from './ducks/labelEditor'
import customLabels from './ducks/customLabels'

const rootReducer = combineReducers({
  application,
  labelEditor,
  customLabels
});
export default rootReducer;