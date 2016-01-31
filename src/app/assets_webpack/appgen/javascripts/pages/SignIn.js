import { connect } from 'react-redux'
import React, {Component} from 'react'
import Paper from 'material-ui/lib/paper';
import SignInForm from '../modules/auth/SignInForm'
import { signIn, getUser } from '../modules/auth/api'
import { notification } from '../actions/notification'

const SignIn = ({dispatch}) => {

  const onSubmit = async values => {
    try {
      await signIn(values);
      dispatch(notification("You've been successfully signed in!"));
    } catch (e) {
      dispatch(notification(message));
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
