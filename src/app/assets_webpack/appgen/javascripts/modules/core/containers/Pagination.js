import React, { PropTypes } from 'react';
import { Range, List } from 'immutable'
import { connect } from 'react-redux'
import { Paginator } from '../models'
import { changePage, createPaginatorSelector } from '../ducks/pagination'
import PaginatorPage from '../components/PaginatorPage'

const Pagination = ({ paginator, page, changePage }) => {
  if (paginator.totalCount == null || paginator.totalCount <= paginator.pageSize) {
    return <span />;
  }

  const totalPages = Math.floor((paginator.totalCount + paginator.pageSize - 1) / paginator.pageSize);
  const firstPage = 1;
  const lastPage = totalPages + 1;
  const SPACE = -1;

  // As there might be too many pages, we just render the current page and the immediate pages
  // before and after it. We also add the first page and the last page.
  const pages = Range(Math.max(firstPage, page - 3), Math.min(lastPage, page + 4))
    .toSet()
    .add(firstPage).add(lastPage)
    .toList().sort()
    .reduce((pages, page) =>
      // If the there is a big step between consecutive pages (e.g. first page and then 5th or
      // something), we add a space between them.
      page > pages.last() + 1 ?
        pages.push(SPACE).push(page) : pages.push(page), new List());

  return (
    <div>
      {page > 1 &&
        <PaginatorPage onTouchTap={() => changePage(page - 1)} label="< Prev" />
      }
      {' '}
      {pages.map(i =>
        i == SPACE ? ' ' :
          <PaginatorPage key={i}
            primary={i == page}
            onTouchTap={() => changePage(i)}
            label={i} />
      )}
      {' '}
      {page < totalPages &&
        <PaginatorPage onTouchTap={() => changePage(page + 1)} label="Next >" />
      }
    </div>
  );
};

Pagination.propTypes = {
  name: PropTypes.string.isRequired,
  paginator: PropTypes.instanceOf(Paginator).isRequired,
  page: PropTypes.number.isRequired,
  changePage: PropTypes.func.isRequired
};

const mapStateToProps = (state, props) => {
  const paginator = createPaginatorSelector(props.name)(state);
  return {
    paginator: paginator,
    page: props.page || paginator.page
  }
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    changePage: props.changePage || (page => dispatch(changePage(props.name, page)))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Pagination);
