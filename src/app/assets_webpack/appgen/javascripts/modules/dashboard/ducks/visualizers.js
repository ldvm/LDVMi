import prefix from '../prefix'
import createAction from '../../../misc/createAction'
import * as api from '../api'
import { notification } from '../../core/ducks/notifications'
import { deleteVisualizer as coreDeleteVisualizer } from '../../core/ducks/visualizers'

// Note: There is a separate core/visualizers duck that handles most of the stuff. This is just
// the dashboard specific functionality.

// Actions

export const DELETE_VISUALIZER = prefix('DELETE_VISUALIZER');
export const DELETE_VISUALIZER_START = DELETE_VISUALIZER + '_START';
export const DELETE_VISUALIZER_ERROR = DELETE_VISUALIZER + '_ERROR';
export const DELETE_VISUALIZER_SUCCESS = DELETE_VISUALIZER + '_SUCCESS';

export function deleteVisualizer(id) {
  return dispatch => {
    const promise = api.deleteVisualizer(id)
      .then(response => {
        dispatch(notification('The visualizer has been deleted'));
        dispatch(coreDeleteVisualizer(id)); // Update the core reducer
        return response;
      })
      .catch(e => {
        dispatch(notification(e.message));
        throw e;
      });
    dispatch(createAction(DELETE_VISUALIZER, { promise }, { id }));
  }
}
