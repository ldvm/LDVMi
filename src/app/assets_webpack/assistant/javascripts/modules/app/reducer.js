import { combineReducers } from 'redux'
import application from './ducks/application'
import lang from './ducks/lang'
import labels from './ducks/labels'
import comments from './ducks/comments'
import labelEditor from './ducks/labelEditor'
import customLabels from './ducks/customLabels'
import limit from './ducks/limit'

const rootReducer = combineReducers({
  application,
  lang,
  labels,
  comments,
  labelEditor,
  customLabels,
  limit
});
export default rootReducer;