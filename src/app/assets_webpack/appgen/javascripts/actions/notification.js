import createAction from '../misc/createAction'

export const NOTIFICATION_SHOW = 'NOTIFICATION_SHOW';
export const NOTIFICATION_HIDE = 'NOTIFICATION_HIDE';

/** Show a user notification for a limited period of time */
export function notification(message, duration = 2000) {
  const id = Math.floor(Math.random() * 100000);
  return dispatch => {
    dispatch(createAction(NOTIFICATION_SHOW, {id, message}));
    setTimeout(() => dispatch(createAction(NOTIFICATION_HIDE, {id})), duration);
  };
}