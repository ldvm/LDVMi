import { fromJS, Map as ImmutableMap } from 'immutable'
import { createSelector } from 'reselect'
import prefix from '../../core/prefix'
import createAction from '../../../misc/createAction'
import * as api from '../api'
import withApplicationId from '../misc/withApplicationId'
import { GET_APPLICATION_START } from './application'
import moduleSelector from '../selector'

// Actions

export const GET_COMMENTS = prefix('GET_COMMENTS');
export const GET_COMMENTS_START = prefix('GET_COMMENTS_START');
export const GET_COMMENTS_ERROR = prefix('GET_COMMENTS_ERROR');
export const GET_COMMENTS_SUCCESS = prefix('GET_COMMENTS_SUCCESS');

let resourceUrisBuffer = [];

export function getComments(resourceUris) {
  return withApplicationId(id => dispatch => {
    // Just like labels, use a buffer to cache uris and then make one big request.
    resourceUrisBuffer = resourceUrisBuffer.concat(resourceUris);
    setTimeout(() => {
      if (resourceUrisBuffer.length > 0) {
        const promise = api.getComments(id, resourceUrisBuffer);
        dispatch(createAction(GET_COMMENTS, { promise }));
        resourceUrisBuffer = [];
      }
    }, 200);
  })
}

// Reducer

const initialState = new ImmutableMap();
export default function commentsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_APPLICATION_START:
      return initialState;

    case GET_COMMENTS_SUCCESS:
      return state.mergeDeep(fromJS(action.payload));
  }
  return state;
}


// Selectors

export const commentsSelector = createSelector(
  [moduleSelector],
  parentState => parentState.comments
);
