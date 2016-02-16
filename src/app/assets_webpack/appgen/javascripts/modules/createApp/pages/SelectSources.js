import React from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { reset as resetForm } from 'redux-form';
import PaperCard from '../../../misc/components/PaperCard'
import Button from '../../../misc/components/Button'
import CenteredMessage from '../../../misc/components/CenteredMessage'
import PromiseResult from '../../../misc/components/PromiseResult'
import ButtonBar from '../../../misc/components/ButtonBar'
import AddDataSourceDialog from '../dialogs/AddDataSourceDialog'
import BrowseDataSourcesDialog from '../dialogs/BrowseDataSourcesDialog'
import SelectedDataSources from '../components/SelectedDataSources'
import { dialogOpen, dialogClose } from '../../../ducks/dialog'
import { notification } from '../../../actions/notification'
import { addDataSource } from '../ducks/dataSources'
import { selectDataSource, deselectDataSource } from '../ducks/selectedDataSources'
import * as api from '../api'
import { dataSourcesSelector } from '../selector'

const SelectSources = ({ dispatch, dataSources }) => {

  const initialValues = {
    graphUris: "",
    isPublic: true
  };

  const handleAddDataSource = async (dataSource) => {
    try {
      dataSource.graphUris = dataSource.graphUris.split('\n');
      const result = await api.addDataSource(dataSource);

      // Well... technically it's one event so dispatching a single action should be enough
      dispatch(notification('New data source has been added'));
      dispatch(resetForm(AddDataSourceDialog.formName));
      dispatch(dialogClose(AddDataSourceDialog.dialogName));
      dispatch(addDataSource(result));
    }
    catch (e) {
      console.log(e);
      dispatch(notification(e.message));
    }
  };

  const handleRunAnalysis = () => {
    const templateIds = dataSources.selected.map(dataSource => dataSource.dataSourceTemplateId);
    if (templateIds.size == 0) {
      dispatch(notification('Please select some data sources first'));
    } else {
      console.log(templateIds.toArray());
    }
  };

  return (
    <PaperCard title="1. Select data sources" subtitle="Select data sources for your new visualization">
      <PromiseResult isLoading={dataSources.isLoading} error={dataSources.error} />

      {dataSources.done && <div>

        {dataSources.selected.size == 0 &&
          <CenteredMessage>Click the 'Browse' button to start selecting data sources.</CenteredMessage>}

        {dataSources.selected.size > 0 &&
          <SelectedDataSources
            dataSources={dataSources.selected}
            deselectDataSource={id => dispatch(deselectDataSource(id))} />}

        <AddDataSourceDialog
          onSubmit={handleAddDataSource}
          initialValues={initialValues}
          dialogClose={name => dispatch(dialogClose(name))} />
        <BrowseDataSourcesDialog
          dialogClose={name => dispatch(dialogClose(name))}
          selectDataSource={id => dispatch(selectDataSource(id))}
          deselectDataSource={id => dispatch(deselectDataSource(id))}
          dataSources={dataSources.all} />

        <ButtonBar
          left={<div>
            <Button
              label="Browse"
              onTouchTap={() => dispatch(dialogOpen(BrowseDataSourcesDialog.dialogName))}
              icon="folder_open" raised />
            <Button
              label="Add new"
              onTouchTap={() => dispatch(dialogOpen(AddDataSourceDialog.dialogName))}
              icon="add" raised success />
            </div>}
          right={<div>
            <Button
              label="Run analysis"
              icon="play_arrow" raised warning
              onTouchTap={handleRunAnalysis}
              disabled={dataSources.selected.size == 0} />
            </div>}/>
      </div>}
    </PaperCard>
  )
};

export default connect(dataSourcesSelector)(SelectSources);
