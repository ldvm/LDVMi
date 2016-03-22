import { combineReducers } from 'redux';
import dialog from './ducks/dialog'
import lang from './ducks/lang'
import promises from './ducks/promises'
import visualizers from './ducks/visualizers'

const rootReducer = combineReducers({
  dialog,
  lang,
  promises,
  visualizers
});
export default rootReducer;