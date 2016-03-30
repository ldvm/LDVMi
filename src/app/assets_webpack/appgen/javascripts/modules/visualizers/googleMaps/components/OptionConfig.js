import React, { PropTypes } from 'react'
import Divider from 'material-ui/lib/divider';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import FontIcon from 'material-ui/lib/font-icon'
import { Option } from '../models'
import Label from '../../../core/containers/Label'
import Padding from '../../../../components/Padding'
import makePureRender from '../../../../misc/makePureRender'
import MaterialTheme from '../../../../misc/materialTheme';
import { optionModes as modes } from  '../models'

const iconMenuStyle = {
  float: 'right',
  marginTop: '-12px',
  marginRight: '-12px',
  position: 'relative',
  zIndex: 1
};

const labelStyle = {
  fontSize: '0.9rem',
  color: 'rgba(0, 0, 0, 0.8)',
  position: 'relative',
  zIndex: 0,
  paddingLeft: MaterialTheme.spacing.desktopGutterMini * 5 + 'px'
};

const iconStyle = {
  position: 'absolute',
  left: 0
};

const countStyle = {
  fontSize: '0.8rem',
  color: 'rgba(0, 0, 0, 0.6)',
  fontWeight: 'bold'
};

const dividerStyle = {
  clear: 'both'
};

const colors = {
  [modes.USER_DEFINED]: 'inherited',
  [modes.SELECT_ALWAYS]: 'rgba(0, 0, 0, 0.3)',
  [modes.SELECT_NEVER]: 'rgba(0, 0, 0, 0.3)'
};

const icons = {
  [modes.USER_DEFINED]: 'chevron_right',
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


const OptionConfig = ({ option, configureOption }) => {
  const { count, mode, skosConcept } = option;

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
      </IconMenu>
      <div style={Object.assign({}, labelStyle, configStyles[mode])}>
        <FontIcon className="material-icons" style={iconStyle} color={colors[mode]}>{icons[mode]}</FontIcon>
        <Label uri={skosConcept.uri} label={skosConcept.label} />
        {count !== null && <span style={countStyle}> ({count})</span>}
      </div>
    </Padding>
    <Divider style={dividerStyle} />
  </div>
};

OptionConfig.propTypes = {
  option: PropTypes.instanceOf(Option).isRequired,
  configureOption: PropTypes.func.isRequired
};

export default makePureRender(OptionConfig);
