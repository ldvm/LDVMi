import { combineReducers } from 'redux'
import dialog from './ducks/dialog'
import promises from './ducks/promises'
import visualizers from './ducks/visualizers'
import notifications from './ducks/notifications'
import loading from './ducks/loading'
import pagination from './ducks/pagination'

const rootReducer = combineReducers({
  dialog,
  loading,
  promises,
  notifications,
  pagination,
  visualizers // TODO: move somewhere else?
});
export default rootReducer;
