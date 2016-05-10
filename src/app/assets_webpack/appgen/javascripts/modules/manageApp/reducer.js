import { combineReducers } from 'redux';
import application from './ducks/application'
import labelEditor from './ducks/labelEditor'

const rootReducer = combineReducers({
  application,
  labelEditor
});
export default rootReducer;