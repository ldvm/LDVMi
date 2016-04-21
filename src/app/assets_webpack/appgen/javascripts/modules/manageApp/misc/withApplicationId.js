import { applicationSelector } from '../selector'

/**
 * A higher-order action creator that will load and inject the current application's id. Useful
 * for action creators that make asynchronous requests to backend.
 */
export default function withApplicationId(callback) {
  return (dispatch, getState) => {
    const appId = applicationSelector(getState()).id;
    dispatch(callback(appId));
  }
}
