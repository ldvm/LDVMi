import React, { PropTypes, Component } from 'react'
import { List } from 'immutable'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import * as routes from '../routes'
import Padding from '../../../components/Padding'
import PromiseResult from '../../core/components/PromiseResult'
import CenteredMessage from '../../../components/CenteredMessage'
import Pagination from '../../core/containers/Pagination'
import { getApplications, getApplicationsReset, deleteApplication, APPLICATIONS_PAGINATOR, createApplicationsSelector, createApplicationsStatusSelector } from '../ducks/applications'
import { destroyPaginator, resetPaginator } from '../../core/ducks/pagination'
import { PromiseStatus } from '../../core/models'
import ApplicationsTable from '../components/ApplicationsTable'
import { visualizersSelector } from '../../core/ducks/visualizers'

class Applications extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    applications: PropTypes.instanceOf(List).isRequired,
    visualizers: PropTypes.instanceOf(List).isRequired,
    status: PropTypes.instanceOf(PromiseStatus).isRequired
  };

  componentWillMount() {
    const { loadPage, props: { dispatch } } = this;
    // dispatch(resetPaginator(APPLICATIONS_PAGINATOR, { pageSize: 6 }));
    loadPage(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.loadPage(nextProps);
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(destroyPaginator(APPLICATIONS_PAGINATOR));
    dispatch(getApplicationsReset());
  }

  loadPage(props) {
    const { dispatch, page, status } = props;
    if (!status.isLoading && !status.error && !status.done) {
      dispatch(getApplications(page));
    }
  }

  changePage(page)  {
    const { dispatch } = this.props;
    dispatch(routes.applications(page));
  }

  render() {
    const { dispatch, applications, visualizers, page, status } = this.props;
    return (
      <div>
        {applications.size > 0 &&
          <ApplicationsTable
            applications={applications}
            visualizers={visualizers}
            deleteApplication={id => dispatch(deleteApplication(id, page))}
          />}

        <Padding space={2}>
          {applications.size == 0 && (
            <div>
              {status.done && <CenteredMessage>No applications found.</CenteredMessage>}
              <PromiseResult status={status} loadingMessage="Loading applications..." />
            </div>
          )}

          <Pagination
            name={APPLICATIONS_PAGINATOR}
            page={page}
            changePage={::this.changePage} />
        </Padding>
      </div>
    );
  }
}

const pageSelector = (_, props) => parseInt(props.routeParams.page || 1);

const selector = createStructuredSelector({
  page: pageSelector,
  applications: createApplicationsSelector(pageSelector),
  visualizers: visualizersSelector,
  status: createApplicationsStatusSelector(pageSelector)
});

export default connect(selector)(Applications);
