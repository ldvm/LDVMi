import React, { PropTypes, Component } from 'react'
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
import IfLoading from '../../core/containers/IfLoading'
import AppLoadingBar from '../components/AppLoadingBar'
import DelayedRender from '../../../components/DelayedRender'
import { getLatestUserApps, latestUserAppsSelector, latestUserAppsStatusSelector } from '../ducks/latestUserApps'

class Platform extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    user: PropTypes.instanceOf(User).isRequired,
    children: PropTypes.node.isRequired // Injected by React Router
  };

  componentWillMount() {
    this.loadLatestUserApps();
  }

  loadLatestUserApps() {
    const { dispatch, user } = this.props;
    if (user.isSignedIn()) {
      dispatch(getLatestUserApps());
    }
  }

  render() {
    const { dispatch, user, children } = this.props;

    return (
      <div>
        <Helmet
          title="Loading..."
          titleTemplate="%s | LDVMi Application Generator"
        />
        <IfLoading>
          <DelayedRender delay={200}>
            <AppLoadingBar />
          </DelayedRender>
        </IfLoading>
        <PlatformAppBar
          user={user}
          goHome={() => dispatch(routeActions.push('/'))}
          signIn={() => dispatch(signIn())}
          signUp={() => dispatch(signUp())}
          signOut={() => dispatch(signOut())}
        />

        {children}

        <Notifications />
      </div>
    );
  }
}

const selector = createStructuredSelector({
  user: userSelector
});

export default connect(selector)(Platform)
