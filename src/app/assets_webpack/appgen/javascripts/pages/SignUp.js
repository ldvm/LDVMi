import { connect } from 'react-redux'
import React, {Component} from 'react'
import Paper from 'material-ui/lib/paper';
import SignUpForm from '../modules/auth/SignUpForm'
import { signUp } from '../modules/auth/api'
import { notification } from '../actions/notification'
import PaperCard from '../misc/components/PaperCard'

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
      <PaperCard title="Sign up" subtitle="Fill some basic info to get your LDVMi account">
        <SignUpForm onSubmit={onSubmit} />
      </PaperCard>
    </div>
  )
};

export default connect()(SignUp);
