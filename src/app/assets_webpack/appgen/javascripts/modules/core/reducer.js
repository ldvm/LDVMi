import { combineReducers } from 'redux'
import dialog from './ducks/dialog'
import promises from './ducks/promises'
import visualizers from './ducks/visualizers'
import notifications from './ducks/notifications'
import loading from './ducks/loading'

const rootReducer = combineReducers({
  dialog,
  loading,
  promises,
  notifications,
  visualizers
});
export default rootReducer;
