import React, { PropTypes, Component } from 'react'
import { List } from 'immutable'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import * as routes from '../routes'
import Padding from '../../../components/Padding'
import PullRight from '../../../components/PullRight'
import ClearBoth from '../../../components/ClearBoth'
import CenteredMessage from '../../../components/CenteredMessage'
import PromiseResult from '../../core/components/PromiseResult'
import Pagination from '../../core/containers/Pagination'
import { destroyPaginator } from '../../core/ducks/pagination'
import { PromiseStatus } from '../../core/models'
import { getDiscoveries, getDiscoveriesReset, deleteDiscovery, deleteAllDiscoveries, createDiscoveriesSelector, createDiscoveriesStatusSelector, DISCOVERIES_PAGINATOR } from '../ducks/discoveries'
import DiscoveriesTable from '../components/DiscoveriesTable'
import DeleteAllDiscoveriesButton from '../components/DeleteAllDiscoveriesButton'

class Discoveries extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    discoveries: PropTypes.instanceOf(List).isRequired,
    status: PropTypes.instanceOf(PromiseStatus).isRequired
  };

  componentWillMount() {
    const { loadPage } = this;
    loadPage(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.loadPage(nextProps);
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(destroyPaginator(DISCOVERIES_PAGINATOR));
    dispatch(getDiscoveriesReset());
  }

  loadPage(props) {
    const { dispatch, page, status } = props;
    if (!status.isLoading && !status.error && !status.done) {
      dispatch(getDiscoveries(page));
    }
  }

  changePage(page)  {
    const { dispatch } = this.props;
    dispatch(routes.discoveries(page));
  }

  render() {
    const { dispatch, discoveries, page, status } = this.props;
    return (
      <div>
        {discoveries.size > 0 &&
          <DiscoveriesTable
            discoveries={discoveries}
            deleteDiscovery={id => dispatch(deleteDiscovery(id, page))}
          />}

        <Padding space={2}>
          {discoveries.size == 0 ? (
            <div>
              {status.done && <CenteredMessage>No discoveries found.</CenteredMessage>}
              <PromiseResult status={status} loadingMessage="Loading discoveries..." />
            </div>
          ) : (
            <PullRight>
              <DeleteAllDiscoveriesButton
                deleteAllDiscoveries={() => dispatch(deleteAllDiscoveries())}
              />
            </PullRight>
          )}

          <Pagination
            name={DISCOVERIES_PAGINATOR}
            page={page}
            changePage={::this.changePage} />
          <ClearBoth />
        </Padding>
      </div>
    );
  }
}

const pageSelector = (_, props) => parseInt(props.routeParams.page || 1);

const selector = createStructuredSelector({
  page: pageSelector,
  discoveries: createDiscoveriesSelector(pageSelector),
  status: createDiscoveriesStatusSelector(pageSelector)
});

export default connect(selector)(Discoveries);
