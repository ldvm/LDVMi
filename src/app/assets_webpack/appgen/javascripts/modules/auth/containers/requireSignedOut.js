import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { userSelector } from '../ducks/user'
import { User } from '../models'
import * as routes from '../../platform/routes'

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
      const {dispatch, user} = props;
      if (user.isSignedIn()) {
        dispatch(routes.profile());
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
