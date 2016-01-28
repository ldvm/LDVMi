import { actionTypes as formActions } from 'redux-form'

/** Maintains the number of running background tasks (i. e. AJAX calls */
export default function loadingReducer(state = 0, action) {
  switch (action.type) {
    case formActions.START_SUBMIT:
      return state + 1;
    case formActions.STOP_SUBMIT:
    case formActions.SUBMIT_FAILED:
      return state - 1;
    default:
      return 0;
  }
}