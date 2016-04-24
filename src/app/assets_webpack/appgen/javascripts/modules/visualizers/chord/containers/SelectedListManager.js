import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import CenteredMessage from '../../../../components/CenteredMessage'
import FillInScreen from '../../../../components/FillInScreen'
import { selectedListSelector } from '../ducks/selectedList'
import { selectNode, removeFromList, removeWithRelatedFromList, listsSelector } from '../ducks/lists'
import { NodeList } from '../models'
import SearchDialog from '../containers/SearchDialog'
import SelectedList from '../components/SelectedList'
import SidebarButtons from '../components/SidebarButtons'
import Padding from '../../../../components/Padding'
import VisualizeSelectedNodesButton from './VisualizeSelectedNodesButton'

const SelectedListManager = ({ dispatch, lists, selectedList, disableManaging, disableSelecting }) => {
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
          select={(uri, selected) => dispatch(selectNode(selectedList.id, uri, selected))}
          remove={uri => dispatch(removeFromList(selectedList.id, uri))}
          removeWithRelated={uri => dispatch(removeWithRelatedFromList(selectedList.id, uri))}
          disableManaging={disableManaging}
          disableSelecting={disableSelecting}
        />
      }
    </FillInScreen>

    {disableManaging ?
      <Padding space={2}>
        <VisualizeSelectedNodesButton fullWidth />
      </Padding> :
      <div>
        <SearchDialog />
        <SidebarButtons />
      </div>
    }
  </div>
};

SelectedListManager.propTypes = {
  dispatch: PropTypes.func.isRequired,
  lists: PropTypes.instanceOf(Map).isRequired,
  selectedList: PropTypes.instanceOf(NodeList),
  disableManaging: PropTypes.bool,
  disableSelecting: PropTypes.bool
};

const selector = createStructuredSelector({
  lists: listsSelector,
  selectedList: selectedListSelector
});

export default connect(selector)(SelectedListManager);
