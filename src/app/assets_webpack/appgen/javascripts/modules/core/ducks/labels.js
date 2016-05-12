import prefix from '../prefix'
import createAction from '../../../misc/createAction'
import * as api from '../api'
import withApplicationId from '../../manageApp/misc/withApplicationId'

// Actions

export const GET_LABELS = prefix('GET_LABELS');
export const GET_LABELS_START = prefix('GET_LABELS_START');
export const GET_LABELS_ERROR = prefix('GET_LABELS_ERROR');
export const GET_LABELS_SUCCESS = prefix('GET_LABELS_SUCCESS');

export function getLabels(resourceUris) {
  return withApplicationId(id => {
    const promise = api.getLabels(id, resourceUris);
    return createAction(GET_LABELS, { promise });
  })
}

