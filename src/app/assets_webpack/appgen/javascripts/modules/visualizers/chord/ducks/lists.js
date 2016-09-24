import { OrderedSet, OrderedMap, fromJS } from 'immutable'
import { createSelector } from 'reselect'
import prefix from '../prefix'
import createAction from '../../../../misc/createAction'
import moduleSelector from '../selector'
import { randomString } from '../../../../misc/utils'
import { NodeList } from '../models'
import { GET_APPLICATION_START } from '../../../app/ducks/application'
import { GET_CONFIGURATION_SUCCESS } from './configuration'
import * as api from '../api.js'
import { createPromiseStatusSelector } from '../../../core/ducks/promises'
import withApplicationId from '../../../app/misc/withApplicationId'

// Actions

export const ADD_LIST = prefix('ADD_LIST');
export function addList() {
  const id = randomString(5);
  return createAction(ADD_LIST, { id });
}

export const REMOVE_LIST = prefix('REMOVE_LIST');
export function removeList(id) {
  return createAction(REMOVE_LIST, { id });
}

export const UPDATE_LIST = prefix('UPDATE_LIST');
export function updateList(id, update) {
  return createAction(UPDATE_LIST, { id, update });
}

export const ADD_TO_LIST = prefix('ADD_TO_LIST');
export function addToList(id, uri) {
  return createAction(ADD_TO_LIST, { id , uri });
}

export const ADD_WITH_RELATED_TO_LIST = prefix('ADD_WITH_RELATED_TO_LIST');
export const ADD_WITH_RELATED_TO_LIST_START = ADD_WITH_RELATED_TO_LIST + '_START';
export const ADD_WITH_RELATED_TO_LIST_ERROR = ADD_WITH_RELATED_TO_LIST + '_ERROR';
export const ADD_WITH_RELATED_TO_LIST_SUCCESS = ADD_WITH_RELATED_TO_LIST + '_SUCCESS';

export function addWithRelatedToList(id, uri, direction = null) {
  return withApplicationId(appId => {
    const promise = api.getRelatedNodes(appId, uri, direction)
      .then(related => {
        related.unshift(uri); // Append the actual uri to the end
        return related;
      });
    return createAction(ADD_WITH_RELATED_TO_LIST,
      { promise },
      { listId: id, id: uri } // The id property here is identifying the promise request.
    );
  })
}

export const SELECT_NODE = prefix('SELECT_NODE');
export function selectNode(id, uri, selected) {
  return createAction(SELECT_NODE, { id, uri, selected });
}

export const REMOVE_FROM_LIST = prefix('REMOVE_FROM_LIST');
export function removeFromList(id, uri) {
  return createAction(REMOVE_FROM_LIST, { id , uri });
}

export const REMOVE_WITH_RELATED_FROM_LIST = prefix('REMOVE_WITH_RELATED_FROM_LIST');
export const REMOVE_WITH_RELATED_FROM_LIST_START = REMOVE_WITH_RELATED_FROM_LIST + '_START';
export const REMOVE_WITH_RELATED_FROM_LIST_ERROR = REMOVE_WITH_RELATED_FROM_LIST + '_ERROR';
export const REMOVE_WITH_RELATED_FROM_LIST_SUCCESS = REMOVE_WITH_RELATED_FROM_LIST + '_SUCCESS';

export function removeWithRelatedFromList(id, uri, direction = 'outgoing') {
  return withApplicationId(appId => {
    const promise = api.getRelatedNodes(appId, uri, direction)
      .then(related => {
        related.unshift(uri); // Append the actual uri to the end
        return related;
      });
    return createAction(REMOVE_WITH_RELATED_FROM_LIST,
      { promise },
      { listId: id, id: uri } // The id property here is identifying the promise request.
    );
  });
}

// Reducer

const reviveList = list => {
  return new NodeList(fromJS(list)
    .update('uris', uris => new OrderedSet(uris))
    .update('selected', selected => new OrderedSet(selected)));
};

const initialState = new OrderedMap();

export default function listsReducer(state = initialState, action) {
  const { payload } = action;

  switch (action.type) {
    case GET_APPLICATION_START:
      return initialState;

    case GET_CONFIGURATION_SUCCESS:
      if ("lists" in action.payload) {
        const configuration = (new OrderedMap(action.payload.lists)).map(list => reviveList(list));
        return initialState.mergeDeep(configuration);
      }
      break;

    case ADD_LIST:
      return state.set(payload.id, new NodeList({ id: payload.id }));

    case REMOVE_LIST:
      return state.remove(payload.id);

    case UPDATE_LIST:
    case ADD_TO_LIST:
    case REMOVE_FROM_LIST:
    case SELECT_NODE:
      return state.update(payload.id, list => listReducer(list, action));

    case ADD_WITH_RELATED_TO_LIST_SUCCESS:
    case REMOVE_WITH_RELATED_FROM_LIST_SUCCESS:
      return state.update(action.meta.listId, list => listReducer(list, action));
  }
  
  return state;
}

function listReducer(list, action) {
  let uri;

  switch (action.type)  {
    case UPDATE_LIST:
      return list.mergeDeep(action.payload.update);

    case ADD_TO_LIST:
      uri = action.payload.uri;
      return list
        .update('uris', uris => uris.add(uri))
        .update('selected', selected => selected.add(uri));

    case ADD_WITH_RELATED_TO_LIST_SUCCESS:
      return list
        .update('uris', uris => uris.union(action.payload))
        .update('selected', selected => selected.union(action.payload));

    case REMOVE_FROM_LIST:
      uri = action.payload.uri;
      return list
        .update('uris', uris => uris.delete(uri))
        .update('selected', selected => selected.delete(uri));

    case REMOVE_WITH_RELATED_FROM_LIST_SUCCESS:
      return list
        .update('uris', uris => uris.subtract(action.payload))
        .update('selected', selected => selected.subtract(action.payload));

    case SELECT_NODE:
      uri = action.payload.uri;
      return list.update('selected', selected =>
        action.payload.selected ? selected.add(uri) : selected.delete(uri));
  }

  return list;
}

// Selectors

export const listsSelector = createSelector(moduleSelector, state => state.lists);

export const createAddWithRelatedStatusSelector = propertyUriExtractor =>
  createPromiseStatusSelector(ADD_WITH_RELATED_TO_LIST, propertyUriExtractor);
