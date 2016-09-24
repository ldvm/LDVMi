import { combineReducers } from 'redux'
import { routeReducer } from 'redux-simple-router'
import { reducer as formReducer } from 'redux-form';
import modulesReducers from '../modules/reducers'

// To avoid another level of nesting, the module reducers with the "system" reducers are merged.
// That might potentially cause a conflict but given the existing names it's rather unlikely.

export default combineReducers(Object.assign({}, {
  routing: routeReducer,
  form: formReducer
}, modulesReducers));
