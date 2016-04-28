import React from 'react'
import SignInContainer from '../containers/SignIn'
import requireSignedOut from '../containers/requireSignedOut'

const SignIn = props => <SignInContainer {...props} />;

export default requireSignedOut(SignIn);
