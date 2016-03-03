import React, { PropTypes } from 'react'
import Divider from 'material-ui/lib/divider';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import { SkosConcept } from '../models'
import Padding from '../../../../misc/components/Padding'
import { settings } from  '../ducks/filterConfigs'

const iconMenuStyle = {
  float: 'right',
  marginTop: '-12px',
  marginRight: '-12px'
};

const labelStyle = {
  fontSize: '0.9rem',
  color: 'rgba(0, 0, 0, 0.8)'
};

const countStyle = {
  fontSize: '0.8rem',
  color: 'rgba(0, 0, 0, 0.6)',
  fontWeight: 'bold'
};

const dividerStyle = {
  clear: 'both'
};

const FilterConfig = ({ skosConcept, count, countLoading, configureFilter }) => {
  const countLabel = countLoading ? '?' :
    (count !== undefined ? count : '-');

  return <div>
    <Padding space={2}>
      <IconMenu
        style={iconMenuStyle}
        iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
        anchorOrigin={{horizontal: 'left', vertical: 'top'}}
        targetOrigin={{horizontal: 'left', vertical: 'top'}}
      >
        <MenuItem
          primaryText="Select always"
          onTouchTap={() => configureFilter(settings.SELECT_ALWAYS)}
        />
        <MenuItem
          primaryText="Select never"
          onTouchTap={() => configureFilter(settings.SELECT_NEVER)}
        />
        <MenuItem primaryText="User defined"
          onTouchTap={() => configureFilter(settings.USER_DEFINED)}
        />
      </IconMenu>
      <div style={labelStyle}>
        {skosConcept.label}{' '}
        <span style={countStyle}>({countLabel})</span>
      </div>
    </Padding>
    <Divider style={dividerStyle} />
  </div>
};

FilterConfig.propTypes = {
  skosConcept: PropTypes.instanceOf(SkosConcept).isRequired,
  count: PropTypes.number,
  countLoading: PropTypes.bool.isRequired,
  configureFilter: PropTypes.func.isRequired
};

export default FilterConfig;
