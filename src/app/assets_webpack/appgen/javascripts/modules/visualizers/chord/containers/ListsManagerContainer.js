import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { addList, removeList, updateList, listsSelector } from '../ducks/lists'
import { selectList, selectedListSelector } from '../ducks/selectedList'
import { NodeList } from '../models'
import ListsManager from '../components/ListsManager'

const ListsManagerContainer = ({ dispatch, lists, selectedList, disableSwitching, disableManaging }) => {
  return <ListsManager
      lists={lists.toList()}
      selectedList={selectedList}
      addList={() => dispatch(addList())}
      removeList={id => dispatch(removeList(id))}
      updateList={(id, name) => dispatch(updateList(id, name))}
      selectList={id => dispatch(selectList(id))}
      disableSwitching={disableSwitching}
      disableManaging={disableManaging}
    />
};

ListsManagerContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  lists: PropTypes.instanceOf(Map).isRequired,
  selectedList: PropTypes.instanceOf(NodeList),
  disableSwitching: PropTypes.bool,
  disableManaging: PropTypes.bool
};

const selector = createStructuredSelector({
  lists: listsSelector,
  selectedList: selectedListSelector
});

export default connect(selector)(ListsManagerContainer);
