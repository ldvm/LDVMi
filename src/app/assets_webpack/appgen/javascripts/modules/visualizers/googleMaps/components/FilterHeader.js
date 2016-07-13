import React, { PropTypes } from 'react'
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';
import { Filter } from '../models'
import EditableLabel from '../../../app/containers/EditableLabel'
import { filterTypes as types, optionModes as modes } from '../models'
import SidebarItem from './SidebarItem'

const headerStyle = {
  backgroundColor: '#f7f7f7'
};

const h3Style = {
  fontWeight: 'normal',
  fontSize: '1.05rem',
  margin: 0,
  padding: 0
};

const FilterConfigHeader = ({ filter, configurable, configureAllOptions, configureFilter, selectAllOptions }) => {
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
    <div style={headerStyle}>
      <SidebarItem
        icon={filter.expanded ? 'expand_more' : 'chevron_right'}
        menuItems={configurable ? configMenuItems : previewMenuItems}
        onClick={() => configureFilter({ expanded: !filter.expanded })}
      >
        <h3 style={h3Style}>
          <EditableLabel uri={property.uri} label={property.label} />
        </h3>
      </SidebarItem>
    </div>);
};

FilterConfigHeader.propTypes = {
  filter: PropTypes.instanceOf(Filter).isRequired,
  configurable: PropTypes.bool,
  configureAllOptions: PropTypes.func,
  configureFilter: PropTypes.func,
  selectAllOptions: PropTypes.func
};

export default FilterConfigHeader;
