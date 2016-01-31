import createAction from '../../misc/createAction'

export const SIGN_IN = 'SIGN_IN';

export function singIn(user) {
  return createAction(SIGN_IN, user);
}

