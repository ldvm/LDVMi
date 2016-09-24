import React, { PropTypes } from 'react'
import Divider from 'material-ui/Divider'
import MenuItem from 'material-ui/MenuItem'
import { Filter } from '../models'
import EditableLabel from '../../../app/containers/EditableLabel'
import { filterTypes as types, optionModes as modes } from '../models'
import SidebarItem from './SidebarItem'

const headerStyle = {
  backgroundColor: '#f7f7f7'
};

const disabledHeaderStyle = {
  textDecoration: 'line-through',
  color: 'rgba(0, 0, 0, 0.3)'
};

const h3Style = {
  fontWeight: 'normal',
  fontSize: '1.05rem',
  margin: 0,
  padding: 0
};

const countStyle = {
  fontSize: '0.9rem',
  color: 'rgba(0, 0, 0, 0.6)',
  fontWeight: 'bold'
};

const FilterConfigHeader = ({ filter, configurable, configureAllOptions, configureFilter, expandFilter, selectAllOptions }) => {
  const { property } = filter;

  const previewMenuItems = (
    <div>
      <MenuItem
        primaryText="Select all"
        onTouchTap={() => selectAllOptions(true)}
        disabled={filter.type == types.RADIO}
      />
      <MenuItem
        primaryText="Select none"
        onTouchTap={() => selectAllOptions(false)}
        disabled={filter.type == types.RADIO}
      />
    </div>);

  const renderCheckedCount = () => {
    const checked = filter.options.filter(option => option.selected).size;
    const total = filter.options.filter(option => option.mode != modes.SELECT_NEVER).size;
    return <span style={countStyle}>({checked}/{total})</span>
  };

  const configMenuItems = (
    <div>
      <MenuItem
        primaryText="All select always"
        onTouchTap={() => configureAllOptions({ mode: modes.SELECT_ALWAYS })}
      />
      <MenuItem
        primaryText="All select never"
        onTouchTap={() => configureAllOptions({ mode: modes.SELECT_NEVER })}
      />
      <MenuItem
        primaryText="All user defined"
        onTouchTap={() => configureAllOptions({ mode: modes.USER_DEFINED })}
      />
      <Divider />
      <MenuItem
        primaryText="Enable"
        disabled={filter.enabled}
        onTouchTap={() => configureFilter({ enabled: true })}
      />
      <MenuItem
        primaryText="Disable"
        disabled={!filter.enabled}
        onTouchTap={() => configureFilter({ enabled: false })}
      />
      <Divider />
      <MenuItem
        primaryText="Checkboxes"
        disabled={filter.type == types.CHECKBOX}
        onTouchTap={() => configureFilter({ type: types.CHECKBOX })}
      />
      <MenuItem
        primaryText="Radios"
        disabled={filter.type == types.RADIO}
        onTouchTap={() => configureFilter({ type: types.RADIO })}
      />
    </div>);

  return (
    <div style={Object.assign({}, headerStyle, !filter.enabled ? disabledHeaderStyle : {})}>
      <SidebarItem
        icon={filter.expanded ? 'expand_more' : 'chevron_right'}
        menuItems={configurable ? configMenuItems : previewMenuItems}
        onClick={() => expandFilter(!filter.expanded)}
      >
        <h3 style={h3Style}>
          <EditableLabel uri={property.uri} label={property.label} />{' '}
          {!configurable && filter.type == types.CHECKBOX && renderCheckedCount()}
        </h3>
      </SidebarItem>
      <Divider />
    </div>);
};

FilterConfigHeader.propTypes = {
  filter: PropTypes.instanceOf(Filter).isRequired,
  configurable: PropTypes.bool,
  configureAllOptions: PropTypes.func,
  configureFilter: PropTypes.func,
  expandFilter: PropTypes.func,
  selectAllOptions: PropTypes.func
};

export default FilterConfigHeader;
