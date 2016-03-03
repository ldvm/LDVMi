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

const configStyles = {
  [settings.USER_DEFINED]: {
  },
  [settings.SELECT_ALWAYS]: {
    color: 'rgba(0, 0, 0, 0.3)'
  },
  [settings.SELECT_NEVER]: {
    color: 'rgba(0, 0, 0, 0.3)',
    textDecoration: 'line-through'
  }
};

const PropertyFilterConfig = ({ skosConcept, count, countLoading, configureFilter, config }) => {
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
          disabled={config == settings.SELECT_ALWAYS}
          onTouchTap={() => configureFilter(settings.SELECT_ALWAYS)}
        />
        <MenuItem
          primaryText="Select never"
          disabled={config == settings.SELECT_NEVER}
          onTouchTap={() => configureFilter(settings.SELECT_NEVER)}
        />
        <MenuItem primaryText="User defined"
          disabled={config == settings.USER_DEFINED}
          onTouchTap={() => configureFilter(settings.USER_DEFINED)}
        />
      </IconMenu>
      <div style={Object.assign({}, labelStyle, configStyles[config])}>
        {skosConcept.label}{' '}
        <span style={countStyle}>({countLabel})</span>
      </div>
    </Padding>
    <Divider style={dividerStyle} />
  </div>
};

PropertyFilterConfig.propTypes = {
  skosConcept: PropTypes.instanceOf(SkosConcept).isRequired,
  count: PropTypes.number,
  countLoading: PropTypes.bool.isRequired,
  configureFilter: PropTypes.func.isRequired,
  config: PropTypes.oneOf([settings.SELECT_ALWAYS, settings.SELECT_NEVER, settings.USER_DEFINED])
};

PropertyFilterConfig.defaultProps = {
  config: settings.USER_DEFINED
};

export default PropertyFilterConfig;
