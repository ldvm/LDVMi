import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import React, {Component} from 'react'
import PaperCard from '../../../misc/components/PaperCard'
import Button from '../../../misc/components/Button'
import AddDataSourceDialog, { dialogName } from '../dialogs/AddDataSourceDialog'
import { dialogOpen, dialogClose } from '../../../ducks/dialog'
import { notification } from '../../../actions/notification'

const SelectSources = ({ dialogOpen, dialogClose, notification }) => {

  const addDataSource = async (data) => {
    // TODO: graphUris = graphUris.split('\n');
    console.log(data);
    notification(data.name);
    dialogClose(dialogName);
  };

  return (
    <PaperCard title="1. Select data sources" subtitle="Select data sources for your new visualization">
      <Button label="Browse" onTouchTap={() => 0} icon="folder_open" raised/>
      <Button label="Add new" onTouchTap={() => dialogOpen(dialogName)} icon="add" raised />
      <AddDataSourceDialog onSubmit={addDataSource} />
    </PaperCard>
  )
};

export default connect(null,
  dispatch => bindActionCreators({ dialogOpen, dialogClose, notification }, dispatch)
)(SelectSources);
