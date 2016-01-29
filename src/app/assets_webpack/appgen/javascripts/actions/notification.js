export const NOTIFICATION_SHOW = 'NOTIFICATION_SHOW';
export const NOTIFICATION_HIDE = 'NOTIFICATION_HIDE';

export function notification(message) {
  // TODO: add support for showing and hiding using promise
  return {
    type: NOTIFICATION_SHOW,
    payload: message
  }
}