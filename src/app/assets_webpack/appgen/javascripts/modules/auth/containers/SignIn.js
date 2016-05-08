import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Link } from 'react-router'
import SignInForm from '../forms/SignInForm'
import * as user from '../ducks/user'
import { notification } from '../../core/ducks/notifications'
import PaperCard from '../../../components/PaperCard'
import GoogleSignInButton from '../components/GoogleSignInButton'
import { createAggregatedPromiseStatusSelector } from '../../core/ducks/promises'
import { PromiseStatus } from '../../core/models'
import { getGoogleClientId } from '../../../window'
import * as routes from '../routes'

const SignIn = ({ dispatch, status }) => {

  const signIn = credentials => {
    dispatch(user.signIn(credentials));
  };

  const googleSignInSuccess = googleUser => {
    dispatch(user.googleSignIn(googleUser));
  };

  const googleSignInFailure = error => {
    console.log(error);
    dispatch(notification('Google sign in failed!'));
  };

  return (
    <PaperCard title="Sign in" subtitle="Enter your credentials for your LDVMi account">
      <div>
        Don't have an account yet? <Link to={routes.signUpUrl()}>Sign up!</Link>
      </div>
      <SignInForm onSubmit={signIn} disabled={status.isLoading} /><br />
      <GoogleSignInButton
        clientId={getGoogleClientId()}
        onSuccess={googleSignInSuccess}
        onFailure={googleSignInFailure}
        disabled={status.isLoading}
      />
    </PaperCard>
  )
};

SignIn.propTypes = {
  dispatch: PropTypes.func.isRequired,
  status: PropTypes.instanceOf(PromiseStatus).isRequired
};

const statusSelector = createAggregatedPromiseStatusSelector([ user.googleSignInStatusSelector ]);

const selector = createStructuredSelector({
  status: statusSelector
});

export default connect(selector)(SignIn);
