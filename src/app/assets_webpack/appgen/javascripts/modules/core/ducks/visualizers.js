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

// Reducers

const initialState = new List();

export default createPromiseReducer(initialState, [
  GET_VISUALIZERS_START,
  GET_VISUALIZERS_SUCCESS,
  GET_VISUALIZERS_ERROR]);

// Selectors

const selector = createSelector([moduleSelector], state => state.visualizers);

export const visualizersSelector = createSelector(
  [selector],
  ({ data }) => data.map(visualizer => new Visualizer(visualizer))
);

export const visualizersStatusSelector = createPromiseStatusSelector(GET_VISUALIZERS);
