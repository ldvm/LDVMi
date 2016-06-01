import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import IconMenu from 'material-ui/lib/menus/icon-menu'
import MenuItem from 'material-ui/lib/menus/menu-item'
import IconButton from '../../../components/IconButton'
import Button from '../../../components/Button'
import { User } from '../../auth/models'
import * as routes from '../../dashboard/routes'

// TODO: come up with a more universal solution
const ButtonWrapper = ({ children }) =>
  <div style={{ marginTop: '8px'}}>{children}</div>

const UserMenu = ({ user, signIn, signUp, signOut }) => {
  const buttonPositioning = {
    targetOrigin: { horizontal: 'right', vertical: 'top' },
    anchorOrigin: { horizontal: 'right', vertical: 'bottom' }
  };

  if (user.isSignedIn()) {
    return (
      <ButtonWrapper>
        <IconMenu
          {...buttonPositioning}
          iconButtonElement={<Button icon="person" label={user.name} inverted />}
        >
          <Link to={routes.dashboardUrl()} style={{ textDecoration: 'none' }}><MenuItem primaryText="Dashboard" /></Link>
          <MenuItem primaryText="Sign out" onTouchTap={signOut} />
        </IconMenu>
      </ButtonWrapper>
    )
  } else {
    return (
      <IconMenu
        {...buttonPositioning}
        iconButtonElement={<IconButton icon="person_outline" color="white" />}
      >
        <MenuItem primaryText="Sign up" onTouchTap={signUp} />
        <MenuItem primaryText="Sign in" onTouchTap={signIn} />
      </IconMenu>
    )
  }

};

UserMenu.propTypes = {
  user: PropTypes.instanceOf(User).isRequired,
  signIn: PropTypes.func.isRequired,
  signUp: PropTypes.func.isRequired,
  signOut: PropTypes.func.isRequired
};

export default UserMenu;
