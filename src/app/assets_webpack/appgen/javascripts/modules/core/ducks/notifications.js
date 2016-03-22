import { List } from 'immutable'
import { createSelector } from 'reselect'
import createAction from '../../../misc/createAction'
import prefix from '../prefix'
import moduleSelector from '../selector'

// Actions

export const NOTIFICATION_SHOW = prefix('NOTIFICATION_SHOW');
export const NOTIFICATION_HIDE = prefix('NOTIFICATION_HIDE');

/** Show a user notification for a limited period of time */
export function notification(message, duration = 2000) {
  const id = Math.floor(Math.random() * 100000);
  return dispatch => {
    dispatch(createAction(NOTIFICATION_SHOW, {id, message}));
    setTimeout(() => dispatch(createAction(NOTIFICATION_HIDE, {id})), duration);
  };
}

// Reducer

export default function notificationsReducer(notifications = new List(), action) {
  switch (action.type) {

    case NOTIFICATION_SHOW:
      return notifications.push(action.payload);

    case NOTIFICATION_HIDE:
      return notifications.filter(notification => notification.id !== action.payload.id);

    default:
      return notifications;
  }
};

// Selectors

export const notificationsSelector = createSelector([moduleSelector], state => state.notifications);
