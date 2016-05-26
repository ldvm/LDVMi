import { Range, List, Map } from 'immutable'
import { createSelector } from 'reselect'
import prefix from '../prefix'
import createAction from '../../../misc/createAction'
import { Paginator, PaginationInfo } from '../models'
import moduleSelector from '../selector'
import { createPromiseStatusSelector } from './promises'

// Misc

export function makePaginationInfo(paginator, page = null) {
  const realPage = page || paginator.page;
  return new PaginationInfo({
    skipCount: (realPage - 1) * paginator.pageSize,
    pageSize: paginator.pageSize
  });
}

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

// Actions

const RESET_PAGINATOR = prefix('RESET_PAGINATOR');
export function resetPaginator(name, paginator) {
  return createAction(RESET_PAGINATOR, { name, paginator });
}

const DESTROY_PAGINATOR = prefix('DESTROY_PAGINATOR');
export function destroyPaginator(name) {
  return createAction(DESTROY_PAGINATOR, { name });
}

const CHANGE_PAGE = prefix('CHANGE_PAGE');
export function changePage(name, page) {
  return createAction(CHANGE_PAGE, { name, page });
}

// Reducers

function paginatorReducer(paginator = new Paginator(), action) {
  switch (action.type) {
    case RESET_PAGINATOR:
      return paginator.merge(action.payload.paginator);

    case CHANGE_PAGE:
      return paginator.set('page', action.payload.page);
  }

  return paginator;
}

export default function paginationReducer(state = new Map(), action) {
  switch (action.type) {
    case RESET_PAGINATOR:
    case CHANGE_PAGE:
      return state.update(action.payload.name, paginator => paginatorReducer(paginator, action));

    case DESTROY_PAGINATOR:
      return state.delete(action.payload.name);
  }

  return state;
}

/**
 * A "virtual" storage that can take pages of items in an arbitrary order (e. g. coming from server)
 * and store them with correct offsets. It is very handy, because it is possible to iterate over
 * this storage or extract pages from this storage even though most of the data is still missing.
 * Thanks to this storage we can use unified pagination API for both data that is available
 * from the beginning and the data that is being fetched lazily.
 * @param {string} paginatorName that his storage is linked to.
 * @param {string} addPageActionType action that carries a new page
 * @param {function} itemExtractor optional function that typically extracts id from each item so
 *  that we don't store the whole data.
 */
export function createPaginatedPlaceholderReducer(paginatorName, addPageActionType, itemExtractor = x => x) {
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
          const items = (new List(action.payload.items)).map(itemExtractor);
          return state.mergeWith((previous, next) => next || previous, skip.concat(items));
        }
        return state;

      case RESET_PAGINATOR:
      case DESTROY_PAGINATOR:
        if (paginatorName === action.payload.name) {
          return initialState;
        }
    }

    return state;
  }
}

// Selectors

const selector = createSelector([moduleSelector], state => state.pagination);

export function createPaginatorSelector(paginatorName) {
  return createSelector([selector], pagination =>
    pagination.get(paginatorName) || new Paginator()
  )
}

export function createPageContentSelector(paginatorName, itemsSelector, pageSelector = () => null) {
  return createSelector(
    [createPaginatorSelector(paginatorName), itemsSelector, pageSelector],
    (paginator, items, page) => {
      if (!List.isList(items)) {
        throw new Error('Pagination is supported only over Imutable.List!');
      }

      const paginationInfo = makePaginationInfo(paginator, page);
      return items.skip(paginationInfo.skipCount).take(paginator.pageSize);
    }
  )
}

export function createPaginatedPromiseStatusSelector(name, paginatorName, pageSelector = () => null) {
  // Use paginator state and (optionally) injected page to create PaginationInfo whose hashCode
  // is identifying the request.
  const idSelector = createSelector(
    [createPaginatorSelector(paginatorName), pageSelector],
    (paginator, page) => makePaginationInfo(paginator, page).hashCode());

  return createPromiseStatusSelector(name, idSelector);
}
