import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { getUser, userSelector, getUserStatusSelector } from '../ducks/user'
import { User } from '../models'
import { PromiseStatus } from '../../core/models'
import PromiseResult from '../../core/components/PromiseResult'
import SignIn from '../pages/SignIn'

export default function requireSignedIn(ComposedComponent) {
  class RequireLogin extends Component {
    static propTypes = {
      dispatch: PropTypes.func.isRequired,
      user: PropTypes.instanceOf(User).isRequired,
      status: PropTypes.instanceOf(PromiseStatus).isRequired
    };

    componentWillMount() {
      const { dispatch, user, status } = this.props;
      if (!user.isSignedIn() && !status.isLoading && !status.done) {
        dispatch(getUser());
      }
    }

    render() {
      const { user, status } = this.props;

      if (user.isSignedIn()) {
        return <ComposedComponent {...this.props} />
      } else if (status.done) {
        return <SignIn />
      } else {
        return <PromiseResult status={status} loadingMessage="Authenticating..." />
      }
    }
  }

  const selector = createStructuredSelector({
    user: userSelector,
    status: getUserStatusSelector
  });

  return connect(selector)(RequireLogin);
}