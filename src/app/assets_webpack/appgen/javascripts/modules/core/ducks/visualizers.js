import { createSelector } from 'reselect'
import { List } from 'immutable'
import { Visualizer } from '../models'
import moduleSelector from '../selector'
import * as api from '../api'
import prefix from '../../createApp/prefix'
import createAction from '../../../misc/createAction'
import { createPromiseStatusSelector } from './promises'

// Actions

export const GET_VISUALIZERS = prefix('GET_VISUALIZERS');
export const GET_VISUALIZERS_START = prefix('GET_VISUALIZERS_START');
export const GET_VISUALIZERS_ERROR = prefix('GET_VISUALIZERS_ERROR');
export const GET_VISUALIZERS_SUCCESS = prefix('GET_VISUALIZERS_SUCCESS');

export function getVisualizers() {
  const promise = api.getVisualizers();
  return createAction(prefix('GET_VISUALIZERS'), { promise });
}

export const ADD_VISUALIZER = prefix('ADD_VISUALIZER');
export function addVisualizer(visualizer) {
  return createAction(ADD_VISUALIZER, { visualizer });
}

export const DELETE_VISUALIZER = prefix('DELETE_VISUALIZER');
export function deleteVisualizer(id) {
  return createAction(DELETE_VISUALIZER, { id });
}

export const UPDATE_VISUALIZER = prefix('UPDATE_VISUALIZER');
export function updateVisualizer(id, update ) {
  return createAction(UPDATE_VISUALIZER, { id, update });
}

// Reducers

const initialState = new List();

export default function visualizersReducer(state = initialState, action) {
  switch (action.type) {
    case GET_VISUALIZERS_SUCCESS:
      return (new List(action.payload)).map(visualizer => new Visualizer(visualizer));

    case ADD_VISUALIZER:
      return state.push(new Visualizer(action.payload.visualizer));
    
    case DELETE_VISUALIZER:
      return state.filter(visualizer => visualizer.id != action.payload.id);

    case UPDATE_VISUALIZER:
      // It's not a map, so we have to search for the visualizer and then update it.
      return state.map(visualizer => visualizer.id == action.payload.id ?
        visualizer.merge(action.payload.update) : visualizer);
  }

  return state;
}

// Selectors

export const visualizersSelector = createSelector([moduleSelector], state => state.visualizers);
export const visualizersStatusSelector = createPromiseStatusSelector(GET_VISUALIZERS);
