import React, { PropTypes } from 'react'
import Helmet from "react-helmet"
import { connect } from 'react-redux'
import { routeActions } from 'redux-simple-router'
import { signIn, signUp } from '../../auth/routes'
import PlatformAppBar from '../components/PlatformAppBar'
import Notifications from '../../core/containers/Notifications'

const Platform = ({ dispatch, children }) =>  {
  return <div>
      <Helmet
        title="Loading..."
        titleTemplate="%s | LDVMi Application Generator"
      />
      <PlatformAppBar
        goHome={() => dispatch(routeActions.push('/'))}
        signIn={() => dispatch(signIn())}
        signUp={() => dispatch(signUp())}
      />

      {children}

      <Notifications />
    </div>;
};

Platform.propTypes = {
  dispatch: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired // Injected by React Router
};

export default connect()(Platform)
