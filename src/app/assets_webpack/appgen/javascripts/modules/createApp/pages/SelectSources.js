import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createSelector } from 'reselect'
import PaperCard from '../../../misc/components/PaperCard'
import Button from '../../../misc/components/Button'
import CenteredMessage from '../../../misc/components/CenteredMessage'
import PromiseResult from '../../../misc/components/PromiseResult'
import AddDataSourceDialog from '../dialogs/AddDataSourceDialog'
import BrowseDataSourcesDialog from '../dialogs/BrowseDataSourcesDialog'
import { dialogOpen, dialogClose } from '../../../ducks/dialog'
import { notification } from '../../../actions/notification'
import { selectDataSource, deselectDataSource } from '../ducks/selectedDataSources'
import * as api from '../api'
import { dataSourcesSelector } from '../selector'

const SelectSources = ({ dialogOpen, dialogClose, notification, selectDataSource, deselectDataSource, dataSources }) => {

  const initialValues = {
    graphUris: "",
    isPublic: true
  };

  const addDataSource = async (dataSource) => {
    try {
      dataSource.graphUris = dataSource.graphUris.split('\n');
      const result = await api.addDataSources(dataSource);

      notification('New data source has been added');
      dialogClose(AddDataSourceDialog.dialogName);
    }
    catch (e) {
      notification(e.message);
    }
  };

  return (
    <PaperCard title="1. Select data sources" subtitle="Select data sources for your new visualization">
      <PromiseResult isLoading={dataSources.isLoading} error={dataSources.error} />

      {dataSources.done && <div>

        {dataSources.selected.map(dataSource => dataSource.name)}

        {dataSources.selected.size == 0 &&
          <CenteredMessage>Click the 'Browse' button to start selecting data sources.</CenteredMessage>}

        <Button
          label="Browse"
          onTouchTap={() => dialogOpen(BrowseDataSourcesDialog.dialogName)}
          icon="folder_open" raised />
        <Button
          label="Add new"
          onTouchTap={() => dialogOpen(AddDataSourceDialog.dialogName)}
          icon="add" raised success />
        <AddDataSourceDialog
          onSubmit={addDataSource}
          initialValues={initialValues}
          dialogClose={dialogClose} />
        <BrowseDataSourcesDialog
          dialogClose={dialogClose}
          selectDataSource={selectDataSource}
          deselectDataSource={deselectDataSource}
          dataSources={dataSources.all} />
      </div>}
    </PaperCard>
  )
};

export default connect(dataSourcesSelector,
  dispatch => bindActionCreators({ dialogOpen, dialogClose, notification, selectDataSource, deselectDataSource }, dispatch)
)(SelectSources);
