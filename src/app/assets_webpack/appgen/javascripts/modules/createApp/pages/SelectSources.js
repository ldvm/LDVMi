import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import React, {Component} from 'react'
import PaperCard from '../../../misc/components/PaperCard'
import Button from '../../../misc/components/Button'
import AddDataSourceDialog, { dialogName } from '../dialogs/AddDataSourceDialog'
import { dialogOpen, dialogClose } from '../../../ducks/dialog'
import { notification } from '../../../actions/notification'
import * as api from '../api'

const SelectSources = ({ dialogOpen, dialogClose, notification }) => {

  const initialValues = {
    graphUris: "",
    isPublic: true
  };

  const addDataSource = async (dataSource) => {
    try {
      dataSource.graphUris = dataSource.graphUris.split('\n');
      const result = await api.addDataSources(dataSource);

      console.log(result);
      // notification(data.name);
      // dialogClose(dialogName);
    }
    catch (e) {
      notification(e.message);
    }
  };

  return (
    <PaperCard title="1. Select data sources" subtitle="Select data sources for your new visualization">
      <Button label="Browse" onTouchTap={() => 0} icon="folder_open" raised />
      <Button label="Add new" onTouchTap={() => dialogOpen(dialogName)} icon="add" raised />
      <AddDataSourceDialog onSubmit={addDataSource} initialValues={initialValues} />
    </PaperCard>
  )
};

export default connect(null,
  dispatch => bindActionCreators({ dialogOpen, dialogClose, notification }, dispatch)
)(SelectSources);
