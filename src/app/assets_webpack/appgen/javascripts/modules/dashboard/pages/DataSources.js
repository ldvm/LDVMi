import React, { PropTypes, Component } from 'react'
import { List } from 'immutable'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import * as routes from '../routes'
import Padding from '../../../components/Padding'
import CenteredMessage from '../../../components/CenteredMessage'
import PromiseResult from '../../core/components/PromiseResult'
import Pagination from '../../core/containers/Pagination'
import { destroyPaginator } from '../../core/ducks/pagination'
import { PromiseStatus } from '../../core/models'
import { getDataSources, getDataSourcesReset, deleteDataSource, createDataSourcesSelector, createDataSourcesStatusSelector, DATA_SOURCES_PAGINATOR } from '../ducks/dataSources'
import DataSourcesTable from '../components/DataSourcesTable'

class DataSources extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    dataSources: PropTypes.instanceOf(List).isRequired,
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
    dispatch(destroyPaginator(DATA_SOURCES_PAGINATOR));
    dispatch(getDataSourcesReset());
  }

  loadPage(props) {
    const { dispatch, page, status } = props;
    if (!status.isLoading && !status.error && !status.done) {
      dispatch(getDataSources(page));
    }
  }

  changePage(page) {
    const { dispatch } = this.props;
    dispatch(routes.dataSources(page));
  }

  render() {
    const { dispatch, dataSources, page, status } = this.props;
    return (
      <div>
        {dataSources.size > 0 &&
          <DataSourcesTable
            dataSources={dataSources}
            deleteDataSource={id => dispatch(deleteDataSource(id, page))}
          />}

        <Padding space={2}>
          {dataSources.size == 0 && (
            <div>
              {status.done && <CenteredMessage>No data sources found.</CenteredMessage>}
              <PromiseResult status={status} loadingMessage="Loading data sources..."/>
            </div>
          )}

          <Pagination
            name={DATA_SOURCES_PAGINATOR}
            page={page}
            changePage={::this.changePage}/>
        </Padding>
      </div>
    );
  }
}

const pageSelector = (_, props) => parseInt(props.routeParams.page || 1);

const selector = createStructuredSelector({
  page: pageSelector,
  dataSources: createDataSourcesSelector(pageSelector),
  status: createDataSourcesStatusSelector(pageSelector)
});

export default connect(selector)(DataSources);