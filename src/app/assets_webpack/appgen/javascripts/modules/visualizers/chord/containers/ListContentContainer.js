import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { selectedListSelector } from '../ducks/selectedList'
import { NodeList } from '../models'
import ListContent from '../components/ListContent'
import CenteredMessage from '../../../../components/CenteredMessage'
import { listsSelector } from '../ducks/lists'
import OpenSearchDialogButton from '../components/OpenSearchDialogButton'
import SearchDialog from '../containers/SearchDialog'
import Padding from '../../../../components/Padding'

const ListContentContainer = ({ lists, selectedList }) => {
  if (lists.size == 0) {
    return <CenteredMessage>
      Start by clicking the 'plus' button to add first list.
    </CenteredMessage>
  }

  if (!selectedList) {
    return <CenteredMessage>
      First select a list from the drop down menu.
    </CenteredMessage>
  }

  return <div>
    <ListContent list={selectedList} />
    <SearchDialog />
    <Padding space={2}>
      <OpenSearchDialogButton fullWidth />
    </Padding>
  </div>
};

ListContentContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  lists: PropTypes.instanceOf(Map).isRequired,
  selectedList: PropTypes.instanceOf(NodeList)
};

const selector = createStructuredSelector({
  lists: listsSelector,
  selectedList: selectedListSelector
});

export default connect(selector)(ListContentContainer);
