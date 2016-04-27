import React, { PropTypes } from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { routeActions } from 'redux-simple-router'
import { createStructuredSelector } from 'reselect'
import { signIn, signUp } from '../../auth/routes'
import { signOut } from '../../auth/ducks/user'
import PlatformAppBar from '../components/PlatformAppBar'
import Notifications from '../../core/containers/Notifications'
import { User } from '../../auth/models'
import { userSelector } from '../../auth/ducks/user'

const Platform = ({ dispatch, user, children }) =>  {
  return <div>
      <Helmet
        title="Loading..."
        titleTemplate="%s | LDVMi Application Generator"
      />
      <PlatformAppBar
        user={user}
        goHome={() => dispatch(routeActions.push('/'))}
        signIn={() => dispatch(signIn())}
        signUp={() => dispatch(signUp())}
        signOut={() => dispatch(signOut())}
      />

      {children}

      <Notifications />
    </div>;
};

Platform.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.instanceOf(User).isRequired,
  children: PropTypes.node.isRequired // Injected by React Router
};

const selector = createStructuredSelector({
  user: userSelector
});

export default connect(selector)(Platform)
