import { combineReducers } from 'redux'
import user from './ducks/user'

const rootReducer = combineReducers({
  user
});
export default rootReducer;
