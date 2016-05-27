import { Range, List, Map } from 'immutable'
import { createSelector } from 'reselect'
import { combineReducers } from 'redux'
import { Paginator } from '../models'
import { createPromiseStatusSelector } from './promises'
import { createPaginatorSelector, createPageContentSelector as _createPageContentSelector, makePaginationInfo, resetPaginator, RESET_PAGINATOR, DESTROY_PAGINATOR } from './pagination'
import createAction from '../../../misc/createAction'

// Extra pagination layer that supports pagination over data that is not immediately available
// and is instead fetched from the backend when required. The backend must support it by sending
// the current totalCount with individual pages.

// Note about deletion support: Deleting an item from the lazily paginated collection creates all
// sorts of possible situations. Typically, all items coming after the deleted item are shifted,
// which causes that the fetched pages are no longer aligned. To keep things simple, the recommended
// way is to dispatch the RESET action to reset the requests and reload the page which will
// cause the paginator to synchronize with the backend. Obviously, the disadvantage is the
// "flicker" of when the current page is being reloaded.

// Misc

/**
 * Action creator helper that injects PaginationInfo generated from selected Paginator. It also
 * augments the dispatched action with pagination meta data.
 * @param {string} paginatorName
 * @param {number|null} page - optional page number which if set, replaces the paginator's value.
 */
export function withPaginationInfo(paginatorName, page = null) {
  return callback => (dispatch, getState) => {
    const paginator = createPaginatorSelector(paginatorName)(getState());
    const paginationInfo = makePaginationInfo(paginator, page);

    let action = callback(paginationInfo);
    action.meta = Object.assign({}, action.meta, {
      id: paginationInfo.hashCode(), // Identify the request
      paginatorName,
      paginationInfo
    });

    dispatch(action);
  }
}

// Middleware

/*** Redux Middleware that synchronizes paginator state with the backend */
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
    // to fetch the first page). We also reset all promise statuses of this type so that the app
    // knows that it has to fetch the pages again
    if (paginator.totalCount !== totalCount) {
      store.dispatch(resetPaginator(paginatorName, new Paginator({
        page: 1,
        pageSize: paginator.pageSize, // Remember pagesize
        totalCount
      })));
      store.dispatch(createAction(action.type.replace('_SUCCESS', '_RESET'))); // Little hacky :-(
    }
  }

  return next(action);
};

// Reducers

/**
 * Create reducer that maintains data coming from server (by pages) in a "paginatable" state.
 * @param {string} paginatorName
 * @param {string} addPageActionType - type of the action carrying a new page
 * @param {function} entitiesReducer - user-provided reducer that holds individual entities
 *  indexed by keys (has to be an Immutable.Map). Can provide arbitrary other functionality
 *  (like entity updates etc.)
 * @param {function} keyExtractor - extract key from an entity
 * @returns {function} reducer
 */
export function createPaginatedReducer(paginatorName, addPageActionType, entitiesReducer, keyExtractor = x => x.id) {
  // We store separately the entities (indexed by keys) and the keys in correct order with
  // correct offsets (they are stored in a "sparse" lazy collection that can be paginated
  // thanks to the order and offsets; see createKeysReducer for more info).
  return combineReducers({
    entities: entitiesReducer,
    keys: createKeysReducer(paginatorName, addPageActionType, keyExtractor)
  });
}

/**
 * Create basic entity reducer that just stores the entities in an Immutable.Map indexed by keys.
 * @param {string} addActionType - type of the action carrying new entities
 * @param {string} resetActionType - type of the action resetting the content
 * @param {function} recordFactory - convert entity into an Immutable.Record (or anything else)
 * @param {function} keyExtractor - extract key from an entity
 * @returns {function} reducer
 */
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
 * Create reducer that maintains entity keys in a collection with correct order and offset which
 * makes the collection "paginatable".
 * @param {string} paginatorName
 * @param {string} addPageActionType - type of the action carrying a new page
 * @param {function} keyExtractor - extract key from an entity
 */
function createKeysReducer(paginatorName, addPageActionType, keyExtractor = x => x.id) {

  // A "virtual" storage that can take pages of items in an arbitrary order (coming from server)
  // and store them with correct offsets. It is very handy, because it is possible to iterate over
  // this storage or extract pages from this storage even though most of the data is still missing.
  // Thanks to this storage we can use unified pagination API for both data that is available
  // from the beginning and the data that is being fetched lazily.

  // Example of how this works: Let's say the page size is 10 and we get the third page. The
  // collection is empty. We insert 20 nulls into the collection and then the 10 entity keys
  // that we received. Then we get the first page. Those ten new entity keys replace the first
  // 10 nulls leaving a space of nulls of size n in the middle of the collection.

  // The pagination information (offset, page size) is part of the action meta information.

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

/**
 * Select page content from the input data. The page size is specified by the paginator and the
 * current page number either by the paginator or by an optional dedicated selector.
 *
 * @param {string} paginatorName
 * @param {function} dataSelector - selector that returns the part of state maintained by the
 *  paginated reducer (see createPaginatedReducer), i. e., it should contain "entities" and "keys".
 * @param {function|null} pageSelector - if set, it is used instead of the internal paginator's value.
 */
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

  // Load the entities for selected page.
  return createSelector(
    [entitiesSelector, keysPageSelector],
    (entities, keys) => keys.map(key => entities.get(key))
  );
}

/**
 * Select promise status of the request fetching a new page.
 * @param name - action type of the request
 * @param paginatorName
 * @param {function|null} pageSelector - if set, it is used instead of the internal paginator's value.
 */
export function createPagePromiseStatusSelector(name, paginatorName, pageSelector = () => null) {
  // Use paginator state and (optionally) injected page to create PaginationInfo whose hashCode
  // is identifying the request.
  const idSelector = createSelector(
    [createPaginatorSelector(paginatorName), pageSelector],
    (paginator, page) => makePaginationInfo(paginator, page).hashCode());

  return createPromiseStatusSelector(name, idSelector);
}
