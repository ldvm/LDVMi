import React, { PropTypes } from 'react'
import { List } from 'immutable'
import { NodeList } from '../models'
import * as theme from '../../../../misc/theme'
import materialTheme from '../../../../misc/materialTheme'
import IconButton from '../../../../components/IconButton'
import ListHeader from './ListHeader'
import ListsSwitch from './ListsSwitch'
import EditListDialog from '../containers/EditListDialog'
import RemoveListDialog from '../containers/RemoveListDialog'

const headerStyle = {
  backgroundColor: theme.primary,
  color: 'white',
  textAlign: 'center',
  fontSize: '14px',
  fontWeight: 500,
  padding: materialTheme.spacing.desktopGutterLess + 'px',
  position: 'relative'
};

const ListsManager = props => {
  const { lists, selectedList, addList, removeList, updateList, selectList} = props;

  return (
    <div style={headerStyle}>
      <ListHeader list={selectedList} />
      <IconButton icon='add' iconStyle={{ color: 'white '}} onTouchTap={addList} />
      {selectedList && <span>
        <EditListDialog
          list={selectedList}
          updateList={updateList}
        />
        <RemoveListDialog
          list={selectedList}
          removeList={removeList}
        /></span>
      }
      <ListsSwitch lists={lists} selectedList={selectedList} selectList={selectList} />
    </div>
  );
};

ListsManager.propTypes = {
  lists: PropTypes.instanceOf(List).isRequired,
  selectedList: PropTypes.instanceOf(NodeList),
  addList: PropTypes.func.isRequired,
  updateList: PropTypes.func.isRequired,
  removeList: PropTypes.func.isRequired,
  selectList: PropTypes.func.isRequired
};

export default ListsManager;
