import React, { PropTypes } from 'react';
import { Range } from 'immutable'
import { connect } from 'react-redux'
import { Paginator } from '../models'
import { changePage, createPaginatorSelector } from '../ducks/pagination'
import PaginatorPage from '../components/PaginatorPage'

const Pagination = ({ paginator, page, changePage }) => {
  if (paginator.totalCount == null || paginator.totalCount <= paginator.pageSize) {
    return <span />;
  }

  const totalPages = Math.floor((paginator.totalCount + paginator.pageSize - 1) / paginator.pageSize);

  return (
    <div>
      {page > 1 &&
        <PaginatorPage onTouchTap={() => changePage(page - 1)} label="< Prev" />
      }
      {' '}
      {Range(1, totalPages + 1).map(i =>
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
