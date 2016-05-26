import { List, Map } from 'immutable'
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

// Actions

export const RESET_PAGINATOR = prefix('RESET_PAGINATOR');
export function resetPaginator(name, paginator) {
  return createAction(RESET_PAGINATOR, { name, paginator });
}

export const DESTROY_PAGINATOR = prefix('DESTROY_PAGINATOR');
export function destroyPaginator(name) {
  return createAction(DESTROY_PAGINATOR, { name });
}

export const CHANGE_PAGE = prefix('CHANGE_PAGE');
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
