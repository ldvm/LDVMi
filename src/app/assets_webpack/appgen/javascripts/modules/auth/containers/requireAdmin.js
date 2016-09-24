import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { userSelector } from '../ducks/user'
import { User } from '../models'
import Alert from '../../../components/Alert'

export default function requireAdmin(ComposedComponent) {
  class RequireAdmin extends Component {
    static propTypes = {
      dispatch: PropTypes.func.isRequired,
      user: PropTypes.instanceOf(User).isRequired
    };

    render() {
      const { user } = this.props;

      if (!user.isAdmin) {
        return <Alert danger>You need to be administrator to view this content.</Alert>
      }

      return <ComposedComponent {...this.props} />
    }
  }

  const selector = createStructuredSelector({
    user: userSelector
  });

  return connect(selector)(RequireAdmin);
}
