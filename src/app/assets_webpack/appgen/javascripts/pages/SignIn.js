import { connect } from 'react-redux'
import React, {Component} from 'react'
import { Link } from 'react-router'
import SignInForm from '../modules/auth/SignInForm'
import { signIn } from '../modules/auth/api'
import * as authActions from '../modules/auth/actions'
import { notification } from '../actions/notification'
import PaperCard from '../misc/components/PaperCard'

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
      <PaperCard title="Sign in" subtitle="Enter your credentials for your LDVMi account">
        <div>
          Don't have an account yet? <Link to="/signup">Sign up!</Link>
        </div>
        <SignInForm onSubmit={onSubmit} />
      </PaperCard>
    </div>
  )
};

export default connect()(SignIn);
