import { Map } from 'immutable'
import { createSelector } from 'reselect'
import prefix from '../prefix'
import createAction from '../../../misc/createAction'
import { Paginator, PaginationInfo } from '../models'
import moduleSelector from '../selector'

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
  }

  return state;
}

// Selectors

const selector = createSelector([moduleSelector], state => state.pagination);

export function createPaginatorSelector(paginatorName) {
  return createSelector([selector], pagination =>
    pagination.get(paginatorName) || new Paginator()
  )
}
