import { createSelector } from 'reselect'
import { List } from 'immutable'
import { Visualizer } from '../models'
import { visualizersSelector as reducerSelector } from '../selector'
import * as api from '../api'
import createPromiseReducer, { PRESERVE_STATE } from '../../../misc/promiseReducer'
import createAction from '../../../misc/createAction'

// Actions
export const GET_VISUALIZERS_START = 'GET_VISUALIZERS_START';
export const GET_VISUALIZERS_ERROR = 'GET_VISUALIZERS_ERROR';
export const GET_VISUALIZERS_SUCCESS = 'GET_VISUALIZERS_SUCCESS';

export function getVisualizers() {
  const promise = api.getVisualizers();
  return createAction('GET_VISUALIZERS', { promise });
}

// Reducers

// Just a sample visualizer
/*
const mapsVisualizer = new Visualizer({
  id: 1,
  name: 'Google Maps',
  componentTemplateId: 3,
  icon: 'maps'
});
*/

const initialState = new List();

export default createPromiseReducer(initialState, [
  GET_VISUALIZERS_START,
  GET_VISUALIZERS_SUCCESS,
  GET_VISUALIZERS_ERROR]);

// Selectors

export const visualizersSelector = createSelector(
  [reducerSelector], ({ data }) =>
    data.map(visualizer => new Visualizer(visualizer))
);
