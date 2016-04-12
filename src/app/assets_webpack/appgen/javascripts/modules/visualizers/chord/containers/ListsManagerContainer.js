import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { addList, removeList, updateList, listsSelector } from '../ducks/lists'
import { selectList, selectedListSelector } from '../ducks/selectedList'
import { NodeList } from '../models'
import ListsManager from '../components/ListsManager'

const ListsManagerContainer = ({ dispatch, lists, selectedList }) => {
  return <ListsManager
      lists={lists.toList()}
      selectedList={selectedList}
      addList={() => dispatch(addList())}
      removeList={id => dispatch(removeList(id))}
      updateList={(id, name) => dispatch(updateList(id, name))}
      selectList={id => dispatch(selectList(id))}
    />
};

ListsManagerContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  lists: PropTypes.instanceOf(Map).isRequired,
  selectedList: PropTypes.instanceOf(NodeList)
};

const selector = createStructuredSelector({
  lists: listsSelector,
  selectedList: selectedListSelector
});

export default connect(selector)(ListsManagerContainer);
