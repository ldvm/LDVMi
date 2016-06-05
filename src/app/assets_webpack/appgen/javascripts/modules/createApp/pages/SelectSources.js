import React, { Component } from 'react'
import Helmet from "react-helmet"
import { connect } from 'react-redux'
import { createSelector, createStructuredSelector } from 'reselect'
import { reset as resetForm } from 'redux-form';
import PaperCard from '../../../components/PaperCard'
import Button from '../../../components/Button'
import CenteredMessage from '../../../components/CenteredMessage'
import PromiseResult from '../../core/components/PromiseResult'
import ButtonBar from '../../../components/ButtonBar'
import AddDataSourceDialog, { dialogName as addDataSourceDialogName, formName as addDataSourceFormName } from '../dialogs/AddDataSourceDialog'
import BrowseDataSourcesDialog, { dialogName as browseDataSourcesDialogName } from '../dialogs/BrowseDataSourcesDialog'
import SelectedDataSources from '../components/SelectedDataSources'
import { dialogOpen, dialogClose } from '../../core/ducks/dialog'
import { notification } from '../../core/ducks/notifications'
import { getDataSources, getDataSourcesReset, addDataSource, dataSourcesSelector, getDataSourcesStatusSelector } from '../ducks/dataSources'
import { runDiscovery } from '../ducks/runDiscoveryStatus'
import { selectDataSource, deselectDataSource, deselectAllDataSources, selectedDataSourcesSelector } from '../ducks/selectedDataSources'
import * as api from '../api'
import { runDiscoveryStatusSelector } from '../ducks/runDiscoveryStatus'

class SelectSources extends Component {

  componentWillMount() {
    const { dispatch, status } = this.props;
    if (!status.done) {
      dispatch(getDataSources());
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(deselectAllDataSources());
    dispatch(getDataSourcesReset())
  }

  async handleAddDataSource(dataSource) {
    const { dispatch } = this.props;

    try {
      dataSource.graphUris = dataSource.graphUris.split('\n');
      const result = await api.addDataSource(dataSource);

      // Well... technically it's one event so dispatching a single action should be enough,
      // but only one of them updates the actual state, the rest is just UI.
      dispatch(notification('New data source has been added'));
      dispatch(resetForm(addDataSourceFormName));
      dispatch(dialogClose(addDataSourceDialogName));
      dispatch(addDataSource(result));
    }
    catch (e) {
      console.log(e);
      dispatch(notification(e.message));
    }
  }

  handleRunAnalysis() {
    const { dispatch, dataSources } = this.props;
    const ids = dataSources.selected.map(dataSource => dataSource.id);
    if (ids.size == 0) {
      dispatch(notification('Please select some data sources first'));
    } else {
      dispatch(runDiscovery(ids));
    }
  }

  render() {
    const { dispatch, dataSources, status, runDiscoveryStatus } = this.props;
    const initialValues = {
      graphUris: '',
      isPublic: true
    };

    return (
      <PaperCard title="Select data sources" subtitle="Select data sources for your new visualization">
        <Helmet title="Select data sources"  />
        <PromiseResult status={status} />
        <PromiseResult status={runDiscoveryStatus} />

        {status.done && <div>

          {dataSources.selected.size == 0 &&
            <CenteredMessage>
              Click the 'Browse' button to start selecting data sources.
            </CenteredMessage>}

          {dataSources.selected.size > 0 &&
            <SelectedDataSources
              dataSources={dataSources.selected}
              deselectDataSource={id => dispatch(deselectDataSource(id))}
            />}

          <AddDataSourceDialog
            onSubmit={::this.handleAddDataSource}
            initialValues={initialValues}
            dialogClose={name => dispatch(dialogClose(name))}
          />

          <BrowseDataSourcesDialog
            dialogClose={name => dispatch(dialogClose(name))}
            selectDataSource={id => dispatch(selectDataSource(id))}
            deselectDataSource={id => dispatch(deselectDataSource(id))}
            dataSources={dataSources.all}
          />

          <ButtonBar
            left={<div>
              <Button
                label="Browse"
                onTouchTap={() => dispatch(dialogOpen(browseDataSourcesDialogName))}
                icon="folder_open" raised />
              <Button
                label="Add new"
                onTouchTap={() => dispatch(dialogOpen(addDataSourceDialogName))}
                icon="add" raised success />
              </div>}
            right={<div>
              <Button
                label="Run analysis"
                icon="play_arrow" raised warning
                onTouchTap={::this.handleRunAnalysis}
                disabled={dataSources.selected.size == 0 || runDiscoveryStatus.isLoading } />
              </div>}
          />
        </div>}
      </PaperCard>
    )
  }
}

const dataSourcesWithSelectedSelector = createSelector(
  [dataSourcesSelector, selectedDataSourcesSelector],
  (dataSources, selectedDataSources) => {
    const all = dataSources.map(dataSource => 
      selectedDataSources.has(dataSource.id) ? 
        dataSource.set('selected', true) : dataSource).toList();
    const selected = all.filter(dataSource => dataSource.selected).toList();
    return { all, selected };
  }
);

const selector = createStructuredSelector({
  dataSources: dataSourcesWithSelectedSelector,
  status: getDataSourcesStatusSelector,
  runDiscoveryStatus: runDiscoveryStatusSelector
});

export default connect(selector)(SelectSources);
