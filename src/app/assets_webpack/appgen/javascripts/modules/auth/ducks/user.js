import createAction from '../../../misc/createAction'
import { notification } from '../../core/ducks/notifications'
import prefix from '../prefix'
import { User } from '../models'
import * as api from '../api'

// Actions

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
      });

    dispatch(createAction(GOOGLE_SIGN_IN, { promise }));
  }
}

// Reducer

export default function authReducer(state = new User(), action) {
  switch (action.type) {
    case SIGN_IN_SUCCESS: 
    case GOOGLE_SIGN_IN_SUCCESS:
      return new User(action.payload);
  }

  return state;
}
