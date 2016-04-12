import React, { PropTypes } from 'react'
import { List } from 'immutable'
import IconMenu from 'material-ui/lib/menus/icon-menu'
import MenuItem from 'material-ui/lib/menus/menu-item'
import IconButton from 'material-ui/lib/icon-button'
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert'
import { NodeList } from '../models'

const ListsSwitch = ({ lists, selectedList, selectList }) => {
  return <span>
    <IconMenu
      iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
      anchorOrigin={{horizontal: 'left', vertical: 'top'}}
      targetOrigin={{horizontal: 'left', vertical: 'top'}}
    >
      {lists.size > 0 ? lists.map(list =>
        <MenuItem
          key={list.id}
          primaryText={list.name}
          onTouchTap={() => selectList(list.id)}
          disabled={list === selectedList}
        /> ) :
        <MenuItem
          primaryText="No lists available"
          disabled
        />
      }
    </IconMenu>
  </span>
};

ListsSwitch.propTypes = {
  lists: PropTypes.instanceOf(List).isRequired,
  selectedList: PropTypes.instanceOf(NodeList),
  selectList: PropTypes.func.isRequired
};

export default ListsSwitch;
