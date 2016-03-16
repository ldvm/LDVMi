import { Map, fromJS } from 'immutable'
import { combineReducers } from 'redux'
import { createSelector } from 'reselect'
import createAction from '../misc/createAction'

// Actions

export const CHANGE_LANGUAGE = 'CHANGE_LANGUAGE';
export const SET_AVAILABLE_LANGUAGES = 'SET_AVAILABLE_LANGUAGE';

export function changeLanguage(lang) {
  return createAction(CHANGE_LANGUAGE, { lang });
}

// TODO: where to get those?
export function setAvailableLanguages(availableLanguages) {
  return createAction(SET_AVAILABLE_LANGUAGES, { availableLanguages });
}

// Reducers

const currentReducer = (state = 'cs', action) => {
  if (action.type == CHANGE_LANGUAGE) {
    return action.payload.lang;
  }
  return state;
};

const availableReducer = (state = Map({ 'cs': 'Česky', 'en': 'English' }), action) => {
  if (action.type == SET_AVAILABLE_LANGUAGES) {
    return fromJS(action.payload.availableLanguages);
  }

  return state;
};

export default combineReducers({
  current: currentReducer,
  available: availableReducer
});

// Selectors

const selector = state => state.lang;

export const langSelector = createSelector([selector], state => state.current);
export const availableLangsSelector = createSelector([selector], state => state.available);
