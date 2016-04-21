import { createSelector } from 'reselect'
import { Map } from 'immutable'
import { createAllPromiseStatusSelector} from '../../../core/ducks/promises'
import createAction from '../../../../misc/createAction'
import prefix from '../prefix'
import { GET_APPLICATION_START } from '../../../manageApp/ducks/application'
import * as api from '../api'
import moduleSelector from '../selector'
import { Node } from '../models'
import storageReducerFactory from '../../../../misc/storageReducerFactory'
import { arrayToObject } from '../../../../misc/utils'
import withApplicationId from '../../../manageApp/misc/withApplicationId'

// Actions

export const GET_NODES = prefix('GET_NODES');
export const GET_NODES_START = GET_NODES + '_START';
export const GET_NODES_ERROR = GET_NODES + '_ERROR';
export const GET_NODES_SUCCESS = GET_NODES + '_SUCCESS';

export function getNodes(nodeUris) {
  return withApplicationId(appId => {
    const promise = api.getNodes(appId, nodeUris);
    return createAction(GET_NODES, { promise });
  });
}

// Reducer

export default storageReducerFactory()
  .setInitialState(new Map())
  .setResetAction(GET_APPLICATION_START)
  .setUpdateAction(GET_NODES_SUCCESS)
  .setUpdate((state, payload) => {
    const map = (new Map(arrayToObject(payload, node => node.uri)))
      .map(node => new Node(node));
    return state.mergeDeep(map);
  })
  .create();

// Selectors

export const nodesStatusSelector = createAllPromiseStatusSelector(GET_NODES);
export const nodesSelector = createSelector([moduleSelector], state => state.nodes);
