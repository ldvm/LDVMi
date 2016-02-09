import { connect } from 'react-redux'
import React, {Component} from 'react'
import PaperCard from '../../../misc/components/PaperCard'
import Button from '../../../misc/components/Button'
import AddDataSourceDialog, { name as dialogName } from '../dialogs/AddDataSourceDialog'
import { dialogOpen } from '../../../ducks/dialog'

const SelectSources = ({dispatch}) => {
  return (
    <PaperCard title="1. Select data sources" subtitle="Select data sources for your new visualization">
      <Button label="Browse" onTouchTap={() => 0} icon="folder_open" raised/>
      <Button label="Add new" onTouchTap={() => dispatch(dialogOpen(dialogName))} icon="add" raised />
      <AddDataSourceDialog />
    </PaperCard>
  )
};

export default connect()(SelectSources);
