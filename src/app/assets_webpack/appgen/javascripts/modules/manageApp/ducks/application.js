import { createSelector } from 'reselect'
import * as api from '../api'
import prefix from '../prefix'
import createPromiseReducer from '../../../misc/promiseReducer'
import createAction from '../../../misc/createAction'
import { createPromiseStatusSelector } from '../../../ducks/promises'
import { Application } from '../models'
import { Visualizer } from '../../common/models'
import { applicationSelector as reducerSelector } from '../selector'
import { visualizersSelector } from '../../common/ducks/visualizers'

// Actions

export const GET_APPLICATION = prefix('GET_APPLICATION');
export const GET_APPLICATION_START = GET_APPLICATION + '_START';
export const GET_APPLICATION_ERROR = GET_APPLICATION + '_ERROR';
export const GET_APPLICATION_SUCCESS = GET_APPLICATION + '_SUCCESS';

export function getApplication(id) {
  const promise = api.getApplication(id);
  return createAction(GET_APPLICATION, { promise });
}

// Reducer

export default function applicationReducer(state = new Application(), action) {
  if (action.type == GET_APPLICATION_SUCCESS) {
    return new Application(action.payload);
  }

  return state;
};

// Selectors

export const applicationSelector = reducerSelector;

export const applicationStatusSelector = createPromiseStatusSelector(GET_APPLICATION);

export const applicationVisualizerSelector = createSelector(
  [applicationSelector, visualizersSelector],
  (application, visualizers) => visualizers
    .filter(visualizer => visualizer.componentTemplateId == application.visualizerComponentTemplateId)
    .get(0) || new Visualizer() // empty as default
);
