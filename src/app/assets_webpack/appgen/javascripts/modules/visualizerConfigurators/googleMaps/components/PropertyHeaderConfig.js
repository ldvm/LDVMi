import React, { PropTypes } from 'react'
import Divider from 'material-ui/lib/divider';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import { Property, PropertyConfig } from '../models'
import Padding from '../../../../misc/components/Padding'
import * as theme from '../../../../misc/theme'
import { settings } from  '../ducks/filterConfigs'
import { types } from '../ducks/propertyConfigs'

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

const PropertyHeaderConfig = ({ property, config, configureAllFilters, configureProperty }) => {
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
          onTouchTap={() => configureAllFilters(settings.SELECT_ALWAYS)}
        />
        <MenuItem
          primaryText="All select never"
          onTouchTap={() => configureAllFilters(settings.SELECT_NEVER)}
        />
        <MenuItem primaryText="All user defined"
          onTouchTap={() => configureAllFilters(settings.USER_DEFINED)}
        />
        <Divider />
        <MenuItem primaryText="Enable"
          disabled={config.enabled}
          onTouchTap={() => configureProperty({ enabled: true })}
        />
        <MenuItem primaryText="Disable"
          disabled={!config.enabled}
          onTouchTap={() => configureProperty({ enabled: false })}
        />
        <Divider />
        <MenuItem primaryText="Checkboxes"
          disabled={config.type == types.CHECKBOX}
          onTouchTap={() => configureProperty({ type: types.CHECKBOX })}
        />
        <MenuItem primaryText="Radios"
          disabled={config.type == types.RADIO}
          onTouchTap={() => configureProperty({ type: types.RADIO })}
        />
      </IconMenu>
      <h3 style={h3Style}>
        {property.label} <br />
        <small style={smallStyle}>{property.uri}</small>
      </h3>
    </Padding>
  </div>
};

PropertyHeaderConfig.propTypes = {
  property: PropTypes.instanceOf(Property).isRequired,
  config: PropTypes.instanceOf(PropertyConfig).isRequired,
  configureAllFilters: PropTypes.func.isRequired,
  configureProperty: PropTypes.func.isRequired
};

export default PropertyHeaderConfig;
