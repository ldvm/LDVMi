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
import ApplicationsTable from '../components/ApplicationsTable'
import { visualizersSelector } from '../../core/ducks/visualizers'
import { getVisualizers } from '../../core/ducks/visualizers'

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
    // dispatch(resetPaginator(APPLICATIONS_PAGINATOR, { pageSize: 5 }));
    dispatch(getVisualizers()); // TODO: wait for it to load
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
    const { applications, visualizers, page, status } = this.props;
    return (
      <div>
        {status.done &&
          <ApplicationsTable
            applications={applications}
            visualizers={visualizers}
          />
        }

        <Padding space={2}>
          <PromiseResult status={status} loadingMessage="Loading applications..."/>
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
