import React, { PropTypes } from 'react'
import AppBar from 'material-ui/lib/app-bar'
import IconButton from 'material-ui/lib/icon-button'
import NavigationClose from 'material-ui/lib/svg-icons/navigation/close'
import IconMenu from 'material-ui/lib/menus/icon-menu'
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert'
import MenuItem from 'material-ui/lib/menus/menu-item'
import FontIcon from 'material-ui/lib/font-icon'
import CircularProgress from 'material-ui/lib/circular-progress'
import Loading from '../../core/containers/Loading'
import makePureRender from '../../../misc/makePureRender'

const PlatformAppBar = ({ goHome, signUp, signIn }) => {

  const title = <span onTouchTap={goHome} className="appbar-logo">
      LDVMi Application Generator
    </span>;

  const left = <IconButton onTouchTap={goHome}>
      <FontIcon className="material-icons">explore</FontIcon>
    </IconButton>;

  const right = <div>
      <Loading>
        <CircularProgress size={0.5} color="white" style={{position: 'absolute', right: '50px'}} />
      </Loading>
      <IconMenu
        iconButtonElement={ <IconButton><MoreVertIcon color="white" /></IconButton> }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}>
        <MenuItem primaryText="Sign up" onTouchTap={signUp} />
        <MenuItem primaryText="Sign in" onTouchTap={signIn} />
      </IconMenu>
    </div>;

  return <AppBar
    className="appbar"
    title={title}
    iconElementLeft={left}
    iconElementRight={right} />
};

PlatformAppBar.propTypes = {
  goHome: PropTypes.func.isRequired,
  signIn: PropTypes.func.isRequired,
  signUp: PropTypes.func.isRequired
};

export default makePureRender(PlatformAppBar);
