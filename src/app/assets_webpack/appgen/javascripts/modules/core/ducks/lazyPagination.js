import { Range, List, Map } from 'immutable'
import { createSelector } from 'reselect'
import { combineReducers } from 'redux'
import { Paginator } from '../models'
import { createPromiseStatusSelector } from './promises'
import { createPaginatorSelector, createPageContentSelector as _createPageContentSelector, makePaginationInfo, resetPaginator, RESET_PAGINATOR, DESTROY_PAGINATOR } from './pagination'

// Misc

export function withPaginationInfo(paginatorName, page = null) {
  return callback => (dispatch, getState) => {
    const paginator = createPaginatorSelector(paginatorName)(getState());
    const paginationInfo = makePaginationInfo(paginator, page);

    let action = callback(paginationInfo);
    action.meta = Object.assign({}, action.meta, {
      id: paginationInfo.hashCode(), // Identify the request
      paginatorName, paginationInfo
    });

    dispatch(action);
  }
}

// Middleware

export const paginationMiddleware = store => next => action => {

  // Intercept all actions that refer to a paginator and carry 'totalCount' in their payload.
  // Typically, such actions are REST responses coming from server.
  if (action.meta && action.meta.paginatorName && action.payload && action.payload.totalCount) {
    const { paginatorName } = action.meta;
    const totalCount = parseInt(action.payload.totalCount);
    const paginator = createPaginatorSelector(paginatorName)(store.getState());

    // If the item count changed (e. g. an item was added or removed by someone else), we dispatch
    // an action that resets the paginator. Note this also covers the situations when the paginator
    // hasn't been initialized yet (e. g. we've just displayed a page and made the first request
    // to fetch the first page).
    if (paginator.totalCount !== totalCount) {
      store.dispatch(resetPaginator(paginatorName, new Paginator({
        page: 1,
        pageSize: paginator.pageSize, // Remember pagesize
        totalCount
      })));
    }
  }

  return next(action);
};

// Reducers

export function createPaginatedReducer(paginatorName, addPageActionType, entitiesReducer, keyExtractor = x => x.id) {
  return combineReducers({
    entities: entitiesReducer,
    keys: createKeysReducer(paginatorName, addPageActionType, keyExtractor)
  });
}

export function createEntitiesReducer(addActionType, resetActionType, recordFactory = x => x, keyExtractor = x => x.id) {
  const initialState = new Map();
  return (state = initialState, action) => {
    switch (action.type) {
      case addActionType:
        if (!action.payload.items) {
          console.warn(`Action ${addActionType}'s payload is missing 'items' property!`);
          return state;
        }

        // State is a key-value storage (Immutable.Map) of entities whereas the incoming items are a
        // collection. Let's insert all items from the collection into the state using under keys
        // generated with keyExtractor()
        return action.payload.items.reduce(
          (state, item) => state.set(keyExtractor(item), recordFactory(item)), state);

      case resetActionType:
        return initialState;
    }

    return state;
  }
}

/**
 * A "virtual" storage that can take pages of items in an arbitrary order (e. g. coming from server)
 * and store them with correct offsets. It is very handy, because it is possible to iterate over
 * this storage or extract pages from this storage even though most of the data is still missing.
 * Thanks to this storage we can use unified pagination API for both data that is available
 * from the beginning and the data that is being fetched lazily.
 *
 * @param {string} paginatorName that this storage is linked to.
 * @param {string} addPageActionType action that carries a new page
 * @param {function} keyExtractor optional function that typically extracts id from each item so
 *  that we don't store the whole data.
 */
function createKeysReducer(paginatorName, addPageActionType, keyExtractor = x => x.id) {
  const initialState = new List();
  return (state = initialState, action) => {
    switch (action.type) {
      case addPageActionType:
        if (!action.meta || !action.meta.paginatorName || !action.meta.paginationInfo) {
          console.warn(`Action ${addPageActionType} is missing pagination meta data!`);
          return state;
        }

        if (!action.payload.items) {
          console.warn(`Action ${addPageActionType}'s payload is missing 'items' property!`);
          return state;
        }

        if (paginatorName === action.meta.paginatorName) {
          // Let's create the correct offset for this page.
          const skip = (new Range(0, action.meta.paginationInfo.skipCount)).map(_ => null).toList();
          const items = (new List(action.payload.items)).map(keyExtractor);
          return state.mergeWith((previous, next) => next || previous, skip.concat(items));
        }
        break;

      case RESET_PAGINATOR:
      case DESTROY_PAGINATOR:
        if (paginatorName === action.payload.name) {
          return initialState;
        }
        break;
    }

    return state;
  }
}


// Selectors

export function createPageContentSelector(paginatorName, dataSelector, pageSelector = () => null) {
  const entitiesSelector = createSelector([dataSelector], data => {
    if (!Map.isMap(data.entities)) {
      console.warn('Entity storage should be an Immutable.Map! Are you sure that you used ' +
        'createPaginatedReducer() factory to create reducer managing this part of state?');
    }
    return data.entities;
  });

  const keysSelector = createSelector([dataSelector], data => {
    if (!List.isList(data.keys)) {
      console.warn('Keys storage should be an Immutable.List! Are you sure that you used ' +
        'createPaginatedReducer() factory to create reducer managing this part of state?');
    }
    return data.keys
  });

  // Select page of keys.
  const keysPageSelector = _createPageContentSelector(paginatorName, keysSelector, pageSelector);

  return createSelector(
    [entitiesSelector, keysPageSelector],
    (entities, keys) => keys.map(key => entities.get(key))
  );
}

export function createPagePromiseStatusSelector(name, paginatorName, pageSelector = () => null) {
  // Use paginator state and (optionally) injected page to create PaginationInfo whose hashCode
  // is identifying the request.
  const idSelector = createSelector(
    [createPaginatorSelector(paginatorName), pageSelector],
    (paginator, page) => makePaginationInfo(paginator, page).hashCode());

  return createPromiseStatusSelector(name, idSelector);
}
