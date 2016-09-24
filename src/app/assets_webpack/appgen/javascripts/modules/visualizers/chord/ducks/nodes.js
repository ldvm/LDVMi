import { createSelector } from 'reselect'
import { Map } from 'immutable'
import { createPromiseStatusSelector } from '../../../core/ducks/promises'
import createAction from '../../../../misc/createAction'
import prefix from '../prefix'
import { GET_APPLICATION_START } from '../../../app/ducks/application'
import * as api from '../api'
import moduleSelector from '../selector'
import { Node } from '../models'
import storageReducerFactory from '../../../../misc/storageReducerFactory'
import { arrayToObject } from '../../../../misc/utils'
import withApplicationId from '../../../app/misc/withApplicationId'
import hash from 'hash-string'

// Misc

function hashNodeUris(nodeUris) {
  return hash(nodeUris.sort().join());
}

// Actions

export const GET_NODES = prefix('GET_NODES');
export const GET_NODES_START = GET_NODES + '_START';
export const GET_NODES_ERROR = GET_NODES + '_ERROR';
export const GET_NODES_SUCCESS = GET_NODES + '_SUCCESS';
export const GET_NODES_RESET = GET_NODES + '_RESET';

export function getNodes(nodeUris) {
  return withApplicationId(appId => {
    const promise = api.getNodes(appId, nodeUris);
    return createAction(GET_NODES, { promise }, { id: hashNodeUris(nodeUris) });
  });
}

export function getNodesReset() {
  // This resets all requests.
  return createAction(GET_NODES_RESET);
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

export const createNodesStatusSelector = nodeUrisExtractor =>
  createPromiseStatusSelector(GET_NODES,
    (state, props) => hashNodeUris(nodeUrisExtractor(state, props)));
export const nodesSelector = createSelector([moduleSelector], state => state.nodes);
