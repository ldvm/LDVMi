import React, { PropTypes } from 'react'
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';
import { Option } from '../models'
import EditableLabel from '../../../app/containers/EditableLabel'
import ClearBoth from '../../../../components/ClearBoth'
import makePureRender from '../../../../misc/makePureRender'
import { optionModes as modes } from  '../models'
import SidebarItem from './SidebarItem'

const labelStyle = {
  fontSize: '0.9rem',
  color: 'rgba(0, 0, 0, 0.8)',
};

const countStyle = {
  fontSize: '0.8rem',
  color: 'rgba(0, 0, 0, 0.6)',
  fontWeight: 'bold'
};

const colors = {
  [modes.USER_DEFINED]: 'inherited',
  [modes.SELECT_ALWAYS]: 'rgba(0, 0, 0, 0.3)',
  [modes.SELECT_NEVER]: 'rgba(0, 0, 0, 0.3)'
};

const icons = {
  [modes.USER_DEFINED]: 'face',
  [modes.SELECT_ALWAYS]: 'check',
  [modes.SELECT_NEVER]: 'close'
};

const configStyles = {
  [modes.USER_DEFINED]: {
  },
  [modes.SELECT_ALWAYS]: {
    color: colors[modes.SELECT_ALWAYS]
  },
  [modes.SELECT_NEVER]: {
    color: colors[modes.SELECT_NEVER],
    textDecoration: 'line-through'
  }
};

// Defines the order in which the modes are changed when the user is clicking the item
const modeLoop = {
  [modes.USER_DEFINED]: modes.SELECT_ALWAYS,
  [modes.SELECT_ALWAYS]: modes.SELECT_NEVER,
  [modes.SELECT_NEVER]: modes.USER_DEFINED
};

const OptionConfig = ({ option, configureOption }) => {
  const { count, mode, skosConcept } = option;

  const menuItems = (
    <div>
      <MenuItem
        primaryText="Select always"
        disabled={mode == modes.SELECT_ALWAYS}
        onTouchTap={() => configureOption({ mode: modes.SELECT_ALWAYS })}
      />
      <MenuItem
        primaryText="Select never"
        disabled={mode == modes.SELECT_NEVER}
        onTouchTap={() => configureOption({ mode: modes.SELECT_NEVER })}
      />
      <MenuItem primaryText="User defined"
        disabled={mode == modes.USER_DEFINED}
        onTouchTap={() => configureOption({ mode: modes.USER_DEFINED })}
      />
    </div>);

  return (
    <div style={Object.assign({}, labelStyle, configStyles[mode])}>
      <SidebarItem
        icon={icons[mode]} iconColor={colors[mode]}
        menuItems={menuItems}
        onClick={() => configureOption({ mode: modeLoop[mode] })}
      >
        <EditableLabel uri={skosConcept.uri} label={skosConcept.label} />
        {count !== null && <span style={countStyle}> ({count})</span>}
      </SidebarItem>
      <ClearBoth />
      <Divider />
    </div>);
};

OptionConfig.propTypes = {
  option: PropTypes.instanceOf(Option).isRequired,
  configureOption: PropTypes.func.isRequired
};

export default makePureRender(OptionConfig);
