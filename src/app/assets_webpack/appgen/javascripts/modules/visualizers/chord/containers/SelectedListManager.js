import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import Padding from '../../../../components/Padding'
import CenteredMessage from '../../../../components/CenteredMessage'
import FillInScreen from '../../../../components/FillInScreen'
import { selectedListSelector } from '../ducks/selectedList'
import { selectNode, removeFromList, removeWithRelatedFromList, listsSelector } from '../ducks/lists'
import { NodeList } from '../models'
import OpenSearchDialogButton from '../components/OpenSearchDialogButton'
import SearchDialog from '../containers/SearchDialog'
import SelectedList from '../components/SelectedList'

const SelectedListManager = ({ dispatch, lists, selectedList }) => {
  if (lists.size == 0) {
    return <CenteredMessage>
      Start by clicking the 'plus' button to add your first list.
    </CenteredMessage>
  }

  if (!selectedList) {
    return <CenteredMessage>
      First select a list from the drop down menu.
    </CenteredMessage>
  }
  
  return <div>
    <FillInScreen marginBottom={100}>
      {selectedList.uris.size == 0 ?
        <CenteredMessage>Click on the green button bellow to add some items.</CenteredMessage> :
        <SelectedList
          nodeUris={selectedList.uris}
          list={selectedList}
          onSelect={(uri, selected) => dispatch(selectNode(selectedList.id, uri, selected))}
          remove={uri => dispatch(removeFromList(selectedList.id, uri))}
          removeWithRelated={uri => dispatch(removeWithRelatedFromList(selectedList.id, uri))}
        />
      }
    </FillInScreen>

    <SearchDialog />
    <Padding space={2}>
      <OpenSearchDialogButton fullWidth />
    </Padding>
  </div>
};

SelectedListManager.propTypes = {
  dispatch: PropTypes.func.isRequired,
  lists: PropTypes.instanceOf(Map).isRequired,
  selectedList: PropTypes.instanceOf(NodeList)
};

const selector = createStructuredSelector({
  lists: listsSelector,
  selectedList: selectedListSelector
});

export default connect(selector)(SelectedListManager);
