import React from 'react'
import Helmet from 'react-helmet'
import SignInContainer from '../containers/SignIn'
import requireSignedOut from '../containers/requireSignedOut'
import SuperNarrowedLayout from '../../../components/SuperNarrowedLayout'

const SignIn = props =>
  <SuperNarrowedLayout>
    <Helmet title="Sign in"  />
    <SignInContainer {...props} />
  </SuperNarrowedLayout>;

export default requireSignedOut(SignIn);
