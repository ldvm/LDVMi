import React, { PropTypes } from 'react'
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Padding from '../../../../components/Padding'
import Icon from '../../../../components/Icon'
import ClearBoth from '../../../../components/ClearBoth'
import MaterialTheme from '../../../../misc/materialTheme'

const iconMenuStyle = {
  float: 'right',
  marginTop: -12,
  marginRight: -12,
  position: 'relative',
  zIndex: 1
};

const labelStyle = {
  fontSize: '0.9rem',
  position: 'relative',
  zIndex: 0,
  paddingLeft: MaterialTheme.spacing.desktopGutterMini * 5
};

const iconStyle = {
  position: 'absolute',
  left: 0
};

const SidebarItem = ({ children, icon, iconColor, menuItems, onClick }) => {
  const cursorStyle = { cursor: onClick ? 'pointer' : 'auto' };

  return (
    <Padding space={2}>
      {menuItems && (
        <IconMenu
          style={iconMenuStyle}
          iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
          anchorOrigin={{horizontal: 'left', vertical: 'top'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
        >
          {menuItems}
        </IconMenu>
      )}

      <div
        style={Object.assign({}, labelStyle, cursorStyle)}
        onClick={onClick || (() => {})}
      >
        <Icon
          icon={icon}
          style={iconStyle}
          color={iconColor || 'inherit'}
        />
        {children}
      </div>

      <ClearBoth />
    </Padding>
  )
};

SidebarItem.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.node.isRequired,
  iconColor: PropTypes.string,
  menuItems: PropTypes.node,
  onClick: PropTypes.func
};

export default SidebarItem;
