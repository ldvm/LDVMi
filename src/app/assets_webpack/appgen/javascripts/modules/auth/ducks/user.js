import createAction from '../../../misc/createAction'
import { createSelector } from 'reselect'
import { notification } from '../../core/ducks/notifications'
import prefix from '../prefix'
import { User } from '../models'
import * as api from '../api'
import moduleSelector from '../selector'
import { createPromiseStatusSelector } from '../../core/ducks/promises'

// Actions

export const GET_USER = prefix('GET_USER');
export const GET_USER_START = GET_USER + '_START';
export const GET_USER_ERROR = GET_USER + '_ERROR';
export const GET_USER_SUCCESS = GET_USER + '_SUCCESS';

export function getUser() {
  const promise = api.getUser()
    // If it fails, don't propagate the error, just treat it as if the user is not logged in.
    .catch(e => ({}));
  return createAction(GET_USER, { promise });
}

export const SIGN_IN = prefix('SIGN_IN');
export const SIGN_IN_START = SIGN_IN + '_START';
export const SIGN_IN_ERROR = SIGN_IN + '_ERROR';
export const SIGN_IN_SUCCESS = SIGN_IN + '_SUCCESS';

export function signIn(credentials) {
  return dispatch => {
    const promise = api.signIn(credentials)
      .then(user => {
        dispatch(notification('You have been successfully signed in!'));
        return user;
      })
      .catch(e => {
        dispatch(notification(e.message));
        throw e;
      });

    dispatch(createAction(SIGN_IN, { promise }));
  }
}

export const GOOGLE_SIGN_IN = prefix('GOOGLE_SIGN_IN');
export const GOOGLE_SIGN_IN_START = GOOGLE_SIGN_IN + '_START';
export const GOOGLE_SIGN_IN_ERROR = GOOGLE_SIGN_IN + '_ERROR';
export const GOOGLE_SIGN_IN_SUCCESS = GOOGLE_SIGN_IN + '_SUCCESS';

export function googleSignIn(googleUser) {
  return dispatch => {
    const promise = api.googleSignIn(googleUser)
      .then(user => {
        dispatch(notification('You have been successfully signed in!'));
        return user;
      })
      .catch(e => {
        dispatch(notification(e.message));
        throw e;
      });

    dispatch(createAction(GOOGLE_SIGN_IN, { promise }));
  }
}

export const SIGN_OUT = prefix('SIGN_OUT');
export const SIGN_OUT_START = SIGN_OUT + '_START';
export const SIGN_OUT_ERROR = SIGN_OUT + '_ERROR';
export const SIGN_OUT_SUCCESS = SIGN_OUT + '_SUCCESS';

export function signOut() {
  return dispatch => {
    const promise = api.signOut()
      .then(response => {
        dispatch(notification('You have been signed out.'));
        return response;
      })
      .catch(e => {
        dispatch(notification(e.message));
        throw e;
      });

    dispatch(createAction(SIGN_OUT, { promise }));
  }
}

// Reducer

export default function authReducer(state = new User(), action) {
  switch (action.type) {
    case SIGN_IN_SUCCESS: 
    case GOOGLE_SIGN_IN_SUCCESS:
    case GET_USER_SUCCESS:
      return new User(action.payload);

    case SIGN_OUT_SUCCESS:
      return new User();
  }

  return state;
}

// Selectors

export const userSelector = createSelector([moduleSelector], state => state.user);
export const getUserStatusSelector = createPromiseStatusSelector(GET_USER);
