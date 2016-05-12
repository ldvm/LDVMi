import { combineReducers } from 'redux';
import application from './ducks/application'
import lang from './ducks/lang'
import labelEditor from './ducks/labelEditor'
import customLabels from './ducks/customLabels'

const rootReducer = combineReducers({
  application,
  lang,
  labelEditor,
  customLabels
});
export default rootReducer;