import { connect } from 'react-redux'
import React, {Component} from 'react'
import Paper from 'material-ui/lib/paper';
import SignInForm from '../modules/auth/SignInForm'
import { signIn } from '../modules/auth/api'
import * as authActions from '../modules/auth/actions'
import { notification } from '../actions/notification'

const SignIn = ({dispatch}) => {

  const onSubmit = async values => {
    try {
      const user = await signIn(values);
      dispatch(notification("You've been successfully signed in!"));
      dispatch(authActions.singIn(user));
    } catch (e) {
      dispatch(notification(e.message));
    }
  };

  return (
    <div className="signup-container">
      <h1>Sign in to LDVMi</h1>
      <Paper>
        <SignInForm onSubmit={onSubmit} className="signup-form" />
      </Paper>
    </div>
  )
};

export default connect()(SignIn);
