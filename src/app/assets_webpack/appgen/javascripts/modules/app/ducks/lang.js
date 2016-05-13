import { Set } from 'immutable'
import { combineReducers } from 'redux'
import { createSelector } from 'reselect'
import { GET_APPLICATION_START } from './application'
import moduleSelector from '../selector'
import createAction from '../../../misc/createAction'
import prefix from '../prefix'
import { extractLanguages } from '../misc/languageUtils'

// Actions

export const CHANGE_LANGUAGE = prefix('CHANGE_LANGUAGE');

export function changeLanguage(lang) {
  return createAction(CHANGE_LANGUAGE, { lang });
}

// Reducers

const currentReducer = (state = 'cs', action) => {
  if (action.type == CHANGE_LANGUAGE) {
    return action.payload.lang;
  }
  return state;
};

const availableReducer = (state = new Set(), action) => {
  switch (action.type) {
    case GET_APPLICATION_START:
      return new Set();
  }

  // This is were the power of Flux/Redux truly shines. We need to get somehow the list of
  // available languages. The list is not available anywhere, we need to find out by ourselves.
  // One of the main aspects of Flux/Redux is that every action is dispatched to every
  // store/reducer. So we can just sit here and monitor all traffic going through the application,
  // regardless of where it comes from (it might come from server, it might be user generated,
  // who knows). And since we have access to the traffic, we just parse it and look for "patterns"
  // that suggest available languages (typically an object with a "variants" property).
  // (Okay, this solution is still pretty dirty, but it's the only that actually works and
  // thanks to Redux it's at least nicely implemented).
  return state.union(extractLanguages(action.payload));
};

export default combineReducers({
  current: currentReducer,
  available: availableReducer
});

// Selectors

const selector = createSelector([moduleSelector], state => state.lang);

export const langSelector = createSelector([selector], state => state.current);
export const availableLangsSelector = createSelector([selector], state => state.available);
