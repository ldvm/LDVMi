import { actionTypes as formActions } from 'redux-form'
import { createSelector } from 'reselect'
import moduleSelector from '../selector'

const START = 'START';
const SUCCESS = 'SUCCESS';
const ERROR = 'ERROR';

// Reducer

/** Maintains the number of running background tasks (i. e. AJAX calls) */
export default function loadingReducer(state = 0, action) {
  if (action.type.match(START + '$')) {
    return state + 1;
  }

  if (action.type.match(SUCCESS + '$') || action.type.match(ERROR + '$')) {
    return Math.max(state - 1, 0);
  }

  switch (action.type) {
    case formActions.START_SUBMIT:
      return state + 1;
    case formActions.STOP_SUBMIT:
    case formActions.SUBMIT_FAILED:
      return Math.max(state - 1, 0);
  }

  return state;
}

// Selectors

export const loadingSelector = createSelector([moduleSelector], state => state.loading);
