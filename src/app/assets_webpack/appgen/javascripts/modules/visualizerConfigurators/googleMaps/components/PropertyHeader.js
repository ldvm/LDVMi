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

const iconMenuStyle = {
  float: 'right',
  marginTop: '-12px',
  marginRight: '-12px'
};

const PropertyHeaderConfig = ({ property, config }) => {
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
        />
        <MenuItem
          primaryText="Select none"
        />
      </IconMenu>
      <h3 style={h3Style}>
        {property.label} <br />
      </h3>
    </Padding>
  </div>
};

PropertyHeaderConfig.propTypes = {
  property: PropTypes.instanceOf(Property).isRequired,
  config: PropTypes.instanceOf(PropertyConfig).isRequired
};

export default PropertyHeaderConfig;
