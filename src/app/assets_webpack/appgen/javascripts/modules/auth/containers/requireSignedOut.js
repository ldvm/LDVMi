import React, { Component, PropTypes } from 'react'
import { routeActions } from 'redux-simple-router'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { userSelector } from '../ducks/user'
import { User } from '../models'

export default function requireSignedOut(ComposedComponent) {
  class RequireSignedOut extends Component {
    static propTypes = {
      dispatch: PropTypes.func.isRequired,
      user: PropTypes.instanceOf(User).isRequired
    };

    componentWillMount() {
      this.potentiallyRedirect(this.props);
    }

    componentWillReceiveProps(props) {
      this.potentiallyRedirect(props)
    }

    potentiallyRedirect(props) {
      const { dispatch, user } = props;
      if (user.isSignedIn()) {
        // Originally, we were redirecting to dashboardRoutes.dashboardUrl(). Importing that,
        // however, caused circular dependency with couple of nasty consequences. So let's just
        // redirect to the front page.
        dispatch(routeActions.push('/'));
      }
    }

    render() {
      return <ComposedComponent {...this.props} />
    }
  }

  const selector = createStructuredSelector({
    user: userSelector
  });

  return connect(selector)(RequireSignedOut);
}
