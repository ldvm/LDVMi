import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createSelector } from 'reselect'
import PaperCard from '../../../misc/components/PaperCard'
import Button from '../../../misc/components/Button'
import PromiseResult from '../../../misc/components/PromiseResult'
import AddDataSourceDialog, { dialogName } from '../dialogs/AddDataSourceDialog'
import { dialogOpen, dialogClose } from '../../../ducks/dialog'
import { notification } from '../../../actions/notification'
import * as api from '../api'
import moduleSelector from '../selector'

const SelectSources = ({ dialogOpen, dialogClose, notification, dataSources }) => {

  const initialValues = {
    graphUris: "",
    isPublic: true
  };

  const addDataSource = async (dataSource) => {
    try {
      dataSource.graphUris = dataSource.graphUris.split('\n');
      const result = await api.addDataSources(dataSource);

      console.log(result);
      notification('New data source has been added');
      dialogClose(dialogName);
    }
    catch (e) {
      notification(e.message);
    }
  };

  return (
    <PaperCard title="1. Select data sources" subtitle="Select data sources for your new visualization">
      <PromiseResult isLoading={dataSources.isLoading} error={dataSources.error} />

      {!dataSources.isLoading && !dataSources.error && <div>
        <Button label="Browse" onTouchTap={() => 0} icon="folder_open" raised/>
        <Button label="Add new" onTouchTap={() => dialogOpen(dialogName)} icon="add" raised />
        <AddDataSourceDialog onSubmit={addDataSource} initialValues={initialValues} />
      </div>}
    </PaperCard>
  )
};

export default connect(
  createSelector(moduleSelector, state => ({
    dataSources: state.dataSources
  })),
  dispatch => bindActionCreators({ dialogOpen, dialogClose, notification }, dispatch)
)(SelectSources);
