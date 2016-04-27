import React, { PropTypes } from 'react'
import AppBar from 'material-ui/lib/app-bar'
import IconMenu from 'material-ui/lib/menus/icon-menu'
import MenuItem from 'material-ui/lib/menus/menu-item'
import FontIcon from 'material-ui/lib/font-icon'
import CircularProgress from 'material-ui/lib/circular-progress'
import Loading from '../../core/containers/Loading'
import makePureRender from '../../../misc/makePureRender'
import { User } from '../../auth/models'
import IconButton from '../../../components/IconButton'

const PlatformAppBar = ({ user, goHome, signUp, signIn, signOut }) => {

  const title = <span onTouchTap={goHome} className="appbar-logo">
      LDVMi Application Generator
    </span>;

  const left = <IconButton onTouchTap={goHome} icon="explore" iconStyle={{ color: 'white' }} />;

  const right = <div>
      <Loading>
        <CircularProgress size={0.5} color="white" style={{position: 'absolute', right: '50px'}} />
      </Loading>
      <IconMenu
        iconButtonElement={<IconButton
          icon={user.isSignedIn() ? 'person' : 'person_outline'}
          iconStyle={{ color: 'white' }} /> }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}>

        {user.isSignedIn() ?
          <MenuItem primaryText="Sign out" onTouchTap={signOut} /> :
          [ <MenuItem key="sign-up" primaryText="Sign up" onTouchTap={signUp} />,
            <MenuItem key="sign-in" primaryText="Sign in" onTouchTap={signIn} /> ]}
      </IconMenu>
    </div>;

  return <AppBar
    className="appbar"
    title={title}
    iconElementLeft={left}
    iconElementRight={right} />
};

PlatformAppBar.propTypes = {
  user: PropTypes.instanceOf(User).isRequired,
  goHome: PropTypes.func.isRequired,
  signIn: PropTypes.func.isRequired,
  signUp: PropTypes.func.isRequired,
  signOut: PropTypes.func.isRequired
};

export default makePureRender(PlatformAppBar);
