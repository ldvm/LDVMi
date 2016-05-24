import React from 'react'
import { connect } from 'react-redux'
import * as routes from '../routes'
import Padding from '../../../components/Padding'
import Pagination from '../../core/containers/Pagination'

const Applications = ({ dispatch, routeParams: { page }}) => {
  return (
    <Padding>

      <Pagination
        name="test"
        page={parseInt(page || 1)}
        changePage={page => dispatch(routes.applications(page))} />
    </Padding>
  );
};

export default connect()(Applications);
