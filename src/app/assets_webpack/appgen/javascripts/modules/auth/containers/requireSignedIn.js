import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { getUser, userSelector, getUserStatusSelector } from '../ducks/user'
import { User } from '../models'
import { PromiseStatus } from '../../core/models'
import PromiseResult from '../../core/components/PromiseResult'
import SuperNarrowedLayout from '../../../components/SuperNarrowedLayout'
import SignIn from './SignIn'

export const JUST_FORM = 0;
export const AS_PAGE = 1;

export default function requireSignedIn(ComposedComponent, mode = AS_PAGE) {
  class RequireSignedIn extends Component {
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

      const wrap = children => mode == AS_PAGE ?
        <SuperNarrowedLayout>
          <Helmet title="Sign in"  />
          {children}
        </SuperNarrowedLayout> : children;

      if (user.isSignedIn()) {
        return <ComposedComponent {...this.props} />
      } else if (status.done) {
        return wrap(<SignIn />)
      } else {
        return wrap(<PromiseResult status={status} loadingMessage="Authenticating..." />)
      }
    }
  }

  const selector = createStructuredSelector({
    user: userSelector,
    status: getUserStatusSelector
  });

  return connect(selector)(RequireSignedIn);
}