import prefix from '../prefix'
import createAction from '../../../misc/createAction'

// Actions

const INIT_PAGINATOR = prefix('INIT_PAGINATOR');
export function initPaginator(name, paginator) {
  return createAction(INIT_PAGINATOR, { name, paginator });
}

const CHANGE_PAGE = prefix('CHANGE_PAGE');
export function changePage(name, page) {
  return createAction(CHANGE_PAGE, { name, page });
}
