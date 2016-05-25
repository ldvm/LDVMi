import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import * as routes from '../routes'
import Padding from '../../../components/Padding'
import Pagination from '../../core/containers/Pagination'
import { getApplications, APPLICATIONS_PAGINATOR } from '../ducks/applications'
import { destroyPaginator, resetPaginator } from '../../core/ducks/pagination'

class Applications extends Component {

  componentWillMount() {
    const { loadPage, props: { dispatch } } = this;
    dispatch(resetPaginator(APPLICATIONS_PAGINATOR, { pageSize: 3 }));
    loadPage(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.loadPage(nextProps);
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(destroyPaginator(APPLICATIONS_PAGINATOR));
  }

  loadPage(props) {
    const { dispatch, routeParams: { page } } = props;
    dispatch(getApplications(page));
  }

  changePage(page)  {
    const { dispatch } = this.props;
    dispatch(routes.applications(page));
  }

  render() {
    const { routeParams: { page } } = this.props;
    return (
      <Padding>

        <Pagination
          name={APPLICATIONS_PAGINATOR}
          page={parseInt(page || 1)}
          changePage={::this.changePage} />
      </Padding>
    );
  }
}

export default connect()(Applications);
