import React, { PropTypes } from 'react'
import Divider from 'material-ui/lib/divider';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import { Option } from '../models'
import Padding from '../../../../misc/components/Padding'
import makePureRender from '../../../../misc/makePureRender'
import { optionModes as modes } from  '../models'

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
  [modes.USER_DEFINED]: {
  },
  [modes.SELECT_ALWAYS]: {
    color: 'rgba(0, 0, 0, 0.3)'
  },
  [modes.SELECT_NEVER]: {
    color: 'rgba(0, 0, 0, 0.3)',
    textDecoration: 'line-through'
  }
};

const OptionConfig = ({ option, configureOption }) => {
  const { countLoading, count, mode, skosConcept } = option;

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
        {skosConcept.label}{' '}
        <span style={countStyle}>({countLabel})</span>
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
