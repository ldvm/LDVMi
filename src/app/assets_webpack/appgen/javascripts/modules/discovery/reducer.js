import { combineReducers } from 'redux';
import discovery from './ducks/discovery'
import evaluations from './ducks/evaluations'
import pipeline from './ducks/pipeline'
import pipelines from './ducks/pipelines'
import evaluation from './ducks/evaluation'

const rootReducer = combineReducers({discovery, evaluations, pipeline, pipelines, evaluation});
export default rootReducer;