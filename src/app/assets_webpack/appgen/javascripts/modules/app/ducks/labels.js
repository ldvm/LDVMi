import { Map, fromJS } from 'immutable'
import { createSelector } from 'reselect'
import prefix from '../../core/prefix'
import createAction from '../../../misc/createAction'
import * as api from '../api'
import withApplicationId from '../misc/withApplicationId'
import { GET_APPLICATION_START } from './application'
import moduleSelector from '../selector'

// Actions

export const GET_LABELS = prefix('GET_LABELS');
export const GET_LABELS_START = prefix('GET_LABELS_START');
export const GET_LABELS_ERROR = prefix('GET_LABELS_ERROR');
export const GET_LABELS_SUCCESS = prefix('GET_LABELS_SUCCESS');

let resourceUrisBuffer = [];

export function getLabels(resourceUris) {
  return withApplicationId(id => dispatch => {
    // To avoid fetching the labels one by one, we push the incoming resource URIs into a buffer and
    // wait a little bit before making the request. We basically 'throttle' the API request. Once
    // the wait is over, we make a request to get labels for all resources in the buffer. This deals
    // with the typical situation when React renders many Label components at once and all of them
    // invoke this action.
    //
    // This solution is not exactly clean as it uses a static buffer expecting all labels
    // to belong to the same application (data source). Right now it's not an issue.

    resourceUrisBuffer = resourceUrisBuffer.concat(resourceUris);
    setTimeout(() => {
      if (resourceUrisBuffer.length > 0) {
        const promise = api.getLabels(id, resourceUrisBuffer);
        dispatch(createAction(GET_LABELS, { promise }));
        resourceUrisBuffer = [];
      }
    }, 200);
  })
}

// Reducer

const initialState = new Map();

export default function labelsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_APPLICATION_START:
      return initialState;

    case GET_LABELS_SUCCESS:
      return state.mergeDeep(fromJS(action.payload));
  }
  return state;
}


// Selectors

export const labelsSelector = createSelector(
  [moduleSelector],
  parentState => parentState.labels
);
