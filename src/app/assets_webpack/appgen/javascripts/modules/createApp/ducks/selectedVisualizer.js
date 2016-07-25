import { createSelector } from 'reselect'
import prefix from '../prefix'
import createAction from '../../../misc/createAction'
import moduleSelector from '../selector'
import { visualizersSelector } from '../../core/ducks/visualizers'

// Actions

export const SELECT_VISUALIZER = prefix('SELECT_VISUALIZER');
export function selectVisualizer(visualizerId) {
  return createAction(SELECT_VISUALIZER, visualizerId)
}

// Reducer

const initialState = 0;

export default function selectedVisualizerReducer(state = initialState, action) {
  if (action.type == SELECT_VISUALIZER) {
    return action.payload;
  }

  return state;
}

// Selectors

export const selectedVisualizerIdSelector = createSelector(
  [moduleSelector],
  state => state.selectedVisualizer
);
