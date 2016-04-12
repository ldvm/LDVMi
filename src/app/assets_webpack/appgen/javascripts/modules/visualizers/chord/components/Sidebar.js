import React from 'react'
import Paper from 'material-ui/lib/paper'
import ListManagerContainer from '../containers/ListsManagerContainer'
import ListContentContainer from '../containers/ListContentContainer'

const Sidebar = () => {
  return (
    <Paper zDepth={2}>
      <ListManagerContainer />
      <ListContentContainer />
    </Paper>
  )
};

export default Sidebar;
