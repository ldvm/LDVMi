import React, { PropTypes } from 'react'
import AppBar from 'material-ui/AppBar';
import makePureRender from '../../../misc/makePureRender'
import { User } from '../../auth/models'
import IconButton from '../../../components/IconButton'
import UserMenu from './UserMenu'

const PlatformAppBar = ({ user, goHome, signUp, signIn, signOut }) => {

  const title = <span onTouchTap={goHome} className="appbar-logo">
      LDVMi Application Generator
    </span>;

  const left = <IconButton onTouchTap={goHome} icon="explore" color="white" />;

  const right = <UserMenu user={user} signIn={signIn} signUp={signUp} signOut={signOut} />;

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
