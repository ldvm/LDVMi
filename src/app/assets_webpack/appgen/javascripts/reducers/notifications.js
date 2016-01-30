import { List } from 'immutable'
import { NOTIFICATION_SHOW, NOTIFICATION_HIDE } from '../actions/notification'

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