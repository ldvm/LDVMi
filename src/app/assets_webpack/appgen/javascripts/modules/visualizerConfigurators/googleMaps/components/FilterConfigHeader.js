import React, { PropTypes } from 'react'
import Divider from 'material-ui/lib/divider';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import { Filter } from '../models'
import Padding from '../../../../components/Padding'
import Label from '../../../core/components/Label'
import * as theme from '../../../../misc/theme'
import { filterTypes as types, optionModes as modes } from '../models'

// TODO: show the whole value using tooltip

const headerStyle = {
  backgroundColor: '#f7f7f7'
};

const h3Style = {
  fontWeight: 'normal',
  fontSize: '1.05rem',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  margin: '0',
  padding: '0'
};

const smallStyle = {
  fontSize: '0.9rem',
  color: '#aeaeae'
};

const iconMenuStyle = {
  float: 'right',
  marginTop: '-12px',
  marginRight: '-12px'
};

const FilterConfigHeader = ({ filter, configureAllOptions, configureFilter }) => {
  const { property } = filter;

  return <div style={headerStyle}>
    <Padding space={2}>
      <IconMenu
        style={iconMenuStyle}
        iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
        anchorOrigin={{horizontal: 'left', vertical: 'top'}}
        targetOrigin={{horizontal: 'left', vertical: 'top'}}
      >
        <MenuItem
          primaryText="All select always"
          onTouchTap={() => configureAllOptions({ mode: modes.SELECT_ALWAYS })}
        />
        <MenuItem
          primaryText="All select never"
          onTouchTap={() => configureAllOptions({ mode: modes.SELECT_NEVER })}
        />
        <MenuItem primaryText="All user defined"
          onTouchTap={() => configureAllOptions({ mode: modes.USER_DEFINED })}
        />
        <Divider />
        <MenuItem primaryText="Enable"
          disabled={filter.enabled}
          onTouchTap={() => configureFilter({ enabled: true })}
        />
        <MenuItem primaryText="Disable"
          disabled={!filter.enabled}
          onTouchTap={() => configureFilter({ enabled: false })}
        />
        <Divider />
        <MenuItem primaryText="Checkboxes"
          disabled={filter.type == types.CHECKBOX}
          onTouchTap={() => configureFilter({ type: types.CHECKBOX })}
        />
        <MenuItem primaryText="Radios"
          disabled={filter.type == types.RADIO}
          onTouchTap={() => configureFilter({ type: types.RADIO })}
        />
      </IconMenu>
      <h3 style={h3Style}>
        <Label uri={property.uri} label={property.label} /><br />
        <small style={smallStyle}>{property.uri}</small>
      </h3>
    </Padding>
  </div>
};

FilterConfigHeader.propTypes = {
  filter: PropTypes.instanceOf(Filter).isRequired,
  configureAllOptions: PropTypes.func.isRequired,
  configureFilter: PropTypes.func.isRequired
};

export default FilterConfigHeader;
