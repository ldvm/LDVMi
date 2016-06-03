import { createSelector } from 'reselect'
import { List } from 'immutable'
import { Visualizer } from '../models'
import moduleSelector from '../selector'
import * as api from '../api'
import prefix from '../../createApp/prefix'
import createPromiseReducer, { PRESERVE_STATE } from '../../../misc/promiseReducer'
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

// Reducers

const initialState = new List();

export default function visualizersReducer(state = initialState, action) {
  switch (action.type) {
    case GET_VISUALIZERS_SUCCESS:
      return (new List(action.payload)).map(visualizer => new Visualizer(visualizer));

    case ADD_VISUALIZER:
      return state.push(new Visualizer(action.payload.visualizer));
  }

  return state;
}

// Selectors

export const visualizersSelector = createSelector([moduleSelector], state => state.visualizers);
export const visualizersStatusSelector = createPromiseStatusSelector(GET_VISUALIZERS);
