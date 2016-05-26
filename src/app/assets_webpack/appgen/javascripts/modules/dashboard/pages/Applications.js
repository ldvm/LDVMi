import React, { PropTypes, Component } from 'react'
import { List } from 'immutable'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import * as routes from '../routes'
import Padding from '../../../components/Padding'
import PromiseResult from '../../core/components/PromiseResult'
import Pagination from '../../core/containers/Pagination'
import { getApplications, getApplicationsReset, APPLICATIONS_PAGINATOR, createApplicationsSelector, createApplicationsStatusSelector } from '../ducks/applications'
import { destroyPaginator, resetPaginator } from '../../core/ducks/pagination'
import { PromiseStatus } from '../../core/models'

class Applications extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    applications: PropTypes.instanceOf(List).isRequired,
    status: PropTypes.instanceOf(PromiseStatus).isRequired
  };

  componentWillMount() {
    const { loadPage, props: { dispatch } } = this;
    dispatch(resetPaginator(APPLICATIONS_PAGINATOR, { pageSize: 4 }));
    loadPage(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.page !== nextProps.page) {
      this.loadPage(nextProps);
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(destroyPaginator(APPLICATIONS_PAGINATOR));
    dispatch(getApplicationsReset());
  }

  loadPage(props) {
    const { dispatch, page, status } = props;
    if (!status.done) {
      dispatch(getApplications(page));
    }
  }

  changePage(page)  {
    const { dispatch } = this.props;
    dispatch(routes.applications(page));
  }

  render() {
    const { applications, page, status } = this.props;
    return (
      <Padding space={2}>
        <PromiseResult status={status} loadingMessage="Loading applications..."/>

        {status.done && applications.map(app => app && <div key={app.id}>{app.name}</div>)}

        <Pagination
          name={APPLICATIONS_PAGINATOR}
          page={page}
          changePage={::this.changePage} />
      </Padding>
    );
  }
}

const pageSelector = (_, props) => parseInt(props.routeParams.page || 1);

const selector = createStructuredSelector({
  page: pageSelector,
  applications: createApplicationsSelector(pageSelector),
  status: createApplicationsStatusSelector(pageSelector)
});

export default connect(selector)(Applications);
