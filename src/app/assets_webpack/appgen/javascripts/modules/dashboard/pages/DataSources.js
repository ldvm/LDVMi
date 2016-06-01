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
import { getDataSources, getDataSourcesReset, deleteDataSource, updateDataSource, createDataSourcesSelector, createDataSourcesStatusSelector, DATA_SOURCES_PAGINATOR } from '../ducks/dataSources'
import DataSourcesTable from '../components/DataSourcesTable'
import { editDataSource, dataSourceToEditSelector } from '../ducks/editDataSource'
import { DataSource } from '../../createApp/models'
import EditDataSourceDialog, { dialogName as editDataSourceDialogName } from '../dialogs/EditDataSourceDialog'
import { dialogOpen, dialogClose } from '../../core/ducks/dialog'
import * as api from '../api'
import { notification } from '../../core/ducks/notifications'

class DataSources extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    dataSources: PropTypes.instanceOf(List).isRequired,
    status: PropTypes.instanceOf(PromiseStatus).isRequired,
    dataSourceToEdit: PropTypes.instanceOf(DataSource).isRequired
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

  editDataSource(id) {
    const { dispatch } = this.props;
    dispatch(editDataSource(id));
    dispatch(dialogOpen(editDataSourceDialogName));
  }

  deleteDataSource(id) {
    const { dispatch, page } = this.props;
    dispatch(deleteDataSource(id, page));
  }

  async handleUpdateDataSource(values) {
    const { dispatch, dataSourceToEdit: { id } } = this.props;
    try {
      await api.updateDataSource(id, values);
      dispatch(notification('The data source has been saved'));
      dispatch(dialogClose(editDataSourceDialogName));
      dispatch(updateDataSource(id, values));
    } catch (e) {
      const { message, data } = e;
      dispatch(notification(message));
      if (data) {
        throw data; // Errors for the form
      }
    }
  }

  render() {
    const { dispatch, dataSources, page, status, dataSourceToEdit} = this.props;
    return (
      <div>
        {dataSources.size > 0 &&
          <DataSourcesTable
            dataSources={dataSources}
            editDataSource={::this.editDataSource}
            deleteDataSource={::this.deleteDataSource}
          />}

        <EditDataSourceDialog
          onSubmit={::this.handleUpdateDataSource}
          initialValues={dataSourceToEdit.toJS()}
          dialogClose={name => dispatch(dialogClose(name))}
        />
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
  status: createDataSourcesStatusSelector(pageSelector),
  dataSourceToEdit: dataSourceToEditSelector
});

export default connect(selector)(DataSources);
