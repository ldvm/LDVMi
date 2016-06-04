import { createSelector } from 'reselect'
import prefix from '../prefix'
import createAction from '../../../misc/createAction'
import moduleSelector from '../selector'
import { visualizersSelector } from '../../core/ducks/visualizers'
import { Visualizer } from '../../core/models'

// Actions

export const EDIT_VISUALIZER = prefix('EDIT_VISUALIZER');
export function editVisualizer(id) {
  return createAction(EDIT_VISUALIZER, { id });
}

// Reducers

export default function editVisualizerReducer(state = 0, action) {
  if (action.type == EDIT_VISUALIZER) {
    return action.payload.id;
  }
  return state;
}

// Selectors

export const visualizerToEditSelector = createSelector(
  [moduleSelector, visualizersSelector],
  (parentState, visualizers) =>
    visualizers.filter(visualizer => visualizer.id == parentState.editVisualizer).get(0) || new Visualizer()
);

