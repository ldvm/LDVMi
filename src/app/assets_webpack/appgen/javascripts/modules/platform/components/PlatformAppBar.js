import React, { PropTypes } from 'react'
import AppBar from 'material-ui/lib/app-bar'
import CircularProgress from 'material-ui/lib/circular-progress'
import Loading from '../../core/containers/Loading'
import makePureRender from '../../../misc/makePureRender'
import { User } from '../../auth/models'
import IconButton from '../../../components/IconButton'
import UserMenu from './UserMenu'

const PlatformAppBar = ({ user, goHome, signUp, signIn, signOut }) => {

  const title = <span onTouchTap={goHome} className="appbar-logo">
      LDVMi Application Generator
    </span>;

  const left = <IconButton onTouchTap={goHome} icon="explore" color="white" />;

  const right = <div>
      <Loading>
        <CircularProgress size={0.5} color="white" style={{position: 'absolute', right: '50%', top: '8px' }} />
      </Loading>
      <UserMenu user={user} signIn={signIn} signUp={signUp} signOut={signOut} />
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
