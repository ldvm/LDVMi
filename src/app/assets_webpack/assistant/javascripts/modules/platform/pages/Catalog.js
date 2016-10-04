import React, { PropTypes, Component } from 'react'
import Helmet from 'react-helmet'
import { List } from 'immutable'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import * as routes from '../routes'
import NarrowedLayout from '../../../components/NarrowedLayout'
import Headline from '../../../components/Headline'
import CenteredMessage from '../../../components/CenteredMessage'
import CenteredText from '../../../components/CenteredText'
import PromiseResult from '../../core/components/PromiseResult'
import Pagination from '../../core/containers/Pagination'
import { destroyPaginator } from '../../core/ducks/pagination'
import { PromiseStatus } from '../../core/models'
import { getPublishedApps, getPublishedAppsReset, createPublishedAppsSelector, createPublishedAppsStatusSelector, PUBLISHED_APPS_PAGINATOR } from '../ducks/publishedApps'
import { visualizersSelector, visualizersStatusSelector } from '../../core/ducks/visualizers'
import { createAggregatedPromiseStatusSelector } from '../../core/ducks/promises'
import { resetPaginator } from '../../core/ducks/pagination'
import PublishedAppsGrid from '../components/PublishedAppsGrid'

class Catalog extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    applications: PropTypes.instanceOf(List).isRequired,
    visualizers: PropTypes.instanceOf(List).isRequired,
    status: PropTypes.instanceOf(PromiseStatus).isRequired
  };

  componentWillMount() {
    const { loadPage, props: { dispatch } } = this;
    dispatch(resetPaginator(PUBLISHED_APPS_PAGINATOR, { pageSize: 12 }));
    loadPage(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.loadPage(nextProps);
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(destroyPaginator(PUBLISHED_APPS_PAGINATOR));
    dispatch(getPublishedAppsReset());
  }

  loadPage(props) {
    const { dispatch, page, status } = props;
    if (!status.isLoading && !status.error && !status.done) {
      dispatch(getPublishedApps(page));
    }
  }

  changePage(page)  {
    const { dispatch } = this.props;
    dispatch(routes.catalog(page));
  }

  render() {
    const { applications, visualizers, page, status } = this.props;
    return (
      <NarrowedLayout>
        <Helmet title="Catalog" />
        <Headline title="Catalog of published applications" icon="import_contacts" />

        {applications.size > 0 ? (
          <PublishedAppsGrid
            applications={applications}
            visualizers={visualizers} />
          ) : (
          <div>
            {status.done && <CenteredMessage>No published applications found.</CenteredMessage>}
            <PromiseResult status={status} loadingMessage="Loading views..." />
          </div>
        )}

        <CenteredText>
          <Pagination
            name={PUBLISHED_APPS_PAGINATOR}
            page={page}
            changePage={::this.changePage} />
        </CenteredText>
      </NarrowedLayout>
    );
  }
}

const pageSelector = (_, props) => parseInt(props.routeParams.page || 1);

const selector = createStructuredSelector({
  page: pageSelector,
  applications: createPublishedAppsSelector(pageSelector),
  visualizers: visualizersSelector,
  status: createAggregatedPromiseStatusSelector([
    createPublishedAppsStatusSelector(pageSelector),
    visualizersStatusSelector
  ])
});

export default connect(selector)(Catalog);
