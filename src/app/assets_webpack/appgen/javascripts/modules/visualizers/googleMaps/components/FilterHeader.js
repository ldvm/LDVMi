import React, { PropTypes } from 'react'
import Divider from 'material-ui/lib/divider';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import { Filter } from '../models'
import Padding from '../../../../components/Padding'
import EditableLabel from '../../../manageApp/containers/EditableLabel'
import * as theme from '../../../../misc/theme'
import { filterTypes as types } from  '../models'

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

const iconMenuStyle = {
  float: 'right',
  marginTop: '-12px',
  marginRight: '-12px'
};

const FilterHeader = ({ filter, selectAllOptions }) => {
  return <div style={headerStyle}>
    <Padding space={2}>
      <IconMenu
        style={iconMenuStyle}
        iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
        anchorOrigin={{horizontal: 'left', vertical: 'top'}}
        targetOrigin={{horizontal: 'left', vertical: 'top'}}
      >
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
      </IconMenu>
      <h3 style={h3Style}>
        <EditableLabel uri={filter.property.uri} label={filter.property.label} /><br />
      </h3>
    </Padding>
  </div>
};

FilterHeader.propTypes = {
  filter: PropTypes.instanceOf(Filter).isRequired,
  selectAllOptions: PropTypes.func.isRequired
};

export default FilterHeader;
