import { connect } from 'react-redux'
import Helmet from "react-helmet"
import React, {Component} from 'react'
import { Link } from 'react-router'
import SignInForm from '../modules/auth/SignInForm'
import { signIn } from '../modules/auth/api'
import * as authActions from '../modules/auth/actions'
import { notification } from '../modules/core/ducks/notifications'
import PaperCard from '../components/PaperCard'
import NarrowedLayout from '../components/NarrowedLayout'

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
    <NarrowedLayout>
      <div className="signup-container">
        <Helmet title="Sign in"  />
        <PaperCard title="Sign in" subtitle="Enter your credentials for your LDVMi account">
          <div>
            Don't have an account yet? <Link to="/signup">Sign up!</Link>
          </div>
          <SignInForm onSubmit={onSubmit} />
        </PaperCard>
      </div>
    </NarrowedLayout>
  )
};

export default connect()(SignIn);
