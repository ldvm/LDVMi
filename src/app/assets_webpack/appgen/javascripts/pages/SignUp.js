import { connect } from 'react-redux'
import React, {Component} from 'react'
import Paper from 'material-ui/lib/paper';
import SignUpForm from '../modules/auth/SignUpForm'
import { signUp } from '../modules/auth/api'
import { notification } from '../actions/notification'

import debugFactory from '../misc/debug'
const debug = debugFactory('signup');

const SignUp = ({dispatch}) => {

  const onSubmit = async values => {
    try {
      await signUp(values);
      dispatch(notification("You've been successfully registered!"));
    } catch (e) {
      const {message, data} = e;
      dispatch(notification(message));
      if (data) {
        throw data; // Errors for the form
      }
    }
  };

  return (
    <div className="signup-container">
      <h1>Sign up to LDVMi</h1>
      <Paper>
        <SignUpForm onSubmit={onSubmit} className="signup-form" />
      </Paper>
    </div>
  )
};

export default connect()(SignUp);
