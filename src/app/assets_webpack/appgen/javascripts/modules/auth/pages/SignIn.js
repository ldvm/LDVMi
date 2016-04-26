import { connect } from 'react-redux'
import Helmet from "react-helmet"
import React, {Component} from 'react'
import { Link } from 'react-router'
import SignInForm from '../forms/SignInForm'
import * as authActions from '../ducks/user'
import { notification } from '../../core/ducks/notifications'
import PaperCard from '../../../components/PaperCard'
import NarrowedLayout from '../../../components/NarrowedLayout'
import GoogleSignInButton from '../components/GoogleSignInButton'

const SignIn = ({ dispatch }) => {

  const signIn = credentials => {
    dispatch(authActions.signIn(credentials));
  };

  const googleSignInSuccess = googleUser => {
    dispatch(authActions.googleSignIn(googleUser));
  };

  const googleSignInFailure = error => {
    console.log(error);
    dispatch(notification('Google sign in failed!'));
  };

  return (
    <NarrowedLayout>
      <div className="signup-container">
        <Helmet title="Sign in"  />
        <PaperCard title="Sign in" subtitle="Enter your credentials for your LDVMi account">
          <div>
            Don't have an account yet? <Link to="/signup">Sign up!</Link>
          </div>
          <SignInForm onSubmit={signIn} /><br />
          <GoogleSignInButton
            clientId="421449098035-d8bj5j92mbemefp6ih2ut0sd7f7k9a9b.apps.googleusercontent.com"
            onSuccess={googleSignInSuccess}
            onFailure={googleSignInFailure}
          />
        </PaperCard>
      </div>
    </NarrowedLayout>
  )
};

export default connect()(SignIn);
