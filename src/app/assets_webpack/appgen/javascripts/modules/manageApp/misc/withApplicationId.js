import { applicationSelector } from '../selector'

/**
 * A higher-order action creator that will load and inject the current application's id. Useful
 * for action creators that make asynchronous requests to backend.
 */
export default function withApplicationId(callback) {
  return (dispatch, getState) => {
    const appId = applicationSelector(getState()).id;
    if (appId == 0) {
      throw new Error('Application is probably not yet loaded! Make sure to load application first before dispatching this action.')
    }
    dispatch(callback(appId));
  }
}
