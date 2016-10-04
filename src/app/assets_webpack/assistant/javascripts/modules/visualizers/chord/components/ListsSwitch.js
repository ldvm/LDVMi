import React, { PropTypes } from 'react'
import { List } from 'immutable'
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import { NodeList } from '../models'

const ListsSwitch = ({ renderButton, lists, selectedList, selectList }) => {
  return <span>
    <IconMenu
      iconButtonElement={renderButton('keyboard_arrow_down')}
      anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
      targetOrigin={{horizontal: 'right', vertical: 'top'}}
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
  renderButton: PropTypes.func.isRequired,
  lists: PropTypes.instanceOf(List).isRequired,
  selectedList: PropTypes.instanceOf(NodeList),
  selectList: PropTypes.func.isRequired
};

export default ListsSwitch;
