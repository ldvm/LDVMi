import { combineReducers } from 'redux';
import dataSources from './ducks/dataSources'

const rootReducer = combineReducers({dataSources});
export default rootReducer;