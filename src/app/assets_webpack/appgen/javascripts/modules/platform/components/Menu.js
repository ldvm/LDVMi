import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Button from '../../../components/Button'
import { User } from '../../auth/models'
import * as dashboardRoutes from '../../dashboard/routes'
import * as platformRoutes from '../routes'
import LatestUserAppsMenu from '../containers/LatestUserAppsMenu'

const menuContainerStyle = {
  marginTop: '8px'
};

const buttonPositioning = {
  targetOrigin: { horizontal: 'right', vertical: 'top' },
  anchorOrigin: { horizontal: 'right', vertical: 'bottom' }
};

const noDecorationStyle = {
  textDecoration: 'none'
};

const Menu = ({ user, signIn, signUp, signOut }) => {
    return user.isSignedIn() ? (
      <div style={menuContainerStyle}>
        <Link to={dashboardRoutes.dashboardUrl()} style={noDecorationStyle}>
          <Button label="Dashboard" inverted />
        </Link>
        <LatestUserAppsMenu />
        <Link to={platformRoutes.catalogUrl()} style={noDecorationStyle}>
          <Button label="Catalog" inverted />
        </Link>
        <Link to={platformRoutes.aboutUrl()} style={noDecorationStyle}>
          <Button label="About" inverted />
        </Link>
        <IconMenu {...buttonPositioning} iconButtonElement={<Button icon="person" label={user.name} inverted />}>
          <MenuItem primaryText="Sign out" onTouchTap={signOut} />
        </IconMenu>
      </div>
    ) : (
      <div style={menuContainerStyle}>
        <Link to={platformRoutes.catalogUrl()} style={noDecorationStyle}>
          <Button label="Catalog" inverted />
        </Link>
        <Link to={platformRoutes.aboutUrl()} style={noDecorationStyle}>
          <Button label="About" inverted />
        </Link>
        <IconMenu {...buttonPositioning} iconButtonElement={<Button label="" icon="person_outline" color="white" inverted style={{ minWidth: '50px'}} />}>
          <MenuItem primaryText="Sign up" onTouchTap={signUp} />
          <MenuItem primaryText="Sign in" onTouchTap={signIn} />
        </IconMenu>
      </div>
    );
};

Menu.propTypes = {
  user: PropTypes.instanceOf(User).isRequired,
  signIn: PropTypes.func.isRequired,
  signUp: PropTypes.func.isRequired,
  signOut: PropTypes.func.isRequired
};

export default Menu;
