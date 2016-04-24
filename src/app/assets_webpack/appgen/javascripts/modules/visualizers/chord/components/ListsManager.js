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

const managerStyle = {
  backgroundColor: theme.primary,
  color: 'white',
  fontSize: '15px',
  fontWeight: 500,
  textAlign: 'right'
};

const headerStyle = {
  float: 'left',
  padding: materialTheme.spacing.desktopGutterLess + 'px',
  paddingRight: 0,
  maxWidth: '180px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
};

const switchStyle = {
  float: 'left'
};

const toolbarStyle = {
};

const iconStyle = {
  color: 'white'
};

const ListsManager = props => {
  const { lists, selectedList, addList, removeList, updateList, selectList} = props;
  const { disableSwitching, disableManaging } = props;

  const renderButton = (icon, action, tooltip) => {
    return <IconButton
      tooltip={tooltip}
      icon={icon}
      iconStyle={iconStyle}
      onTouchTap={action}
    />
  };

  return (
    <div style={managerStyle}>
      <div style={Object.assign({}, headerStyle, disableManaging ? { maxWidth: '320px'} : {})}>
        <ListHeader list={selectedList} />
      </div>
      {disableSwitching || <div style={switchStyle}>
        <ListsSwitch
          renderButton={renderButton}
          lists={lists}
          selectedList={selectedList}
          selectList={selectList} />
      </div>}

      {disableManaging || <div style={toolbarStyle}>
        {renderButton('add', addList, 'Add new list')}
        {selectedList && <EditListDialog
            renderButton={renderButton}
            list={selectedList}
            updateList={updateList}
          />
        }
        {selectedList && <RemoveListDialog
            renderButton={renderButton}
            list={selectedList}
            removeList={removeList}
          />
        }
      </div>}
      <div style={{ clear: 'both '}}></div>
    </div>
  );
};

ListsManager.propTypes = {
  lists: PropTypes.instanceOf(List).isRequired,
  selectedList: PropTypes.instanceOf(NodeList),
  addList: PropTypes.func.isRequired,
  updateList: PropTypes.func.isRequired,
  removeList: PropTypes.func.isRequired,
  selectList: PropTypes.func.isRequired,
  disableSwitching: PropTypes.bool,
  disableManaging: PropTypes.bool
};

export default ListsManager;
