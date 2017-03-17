import { combineReducers } from 'redux';
import event from './ducks/event'

const rootReducer = combineReducers({
    event
});

export default rootReducer;