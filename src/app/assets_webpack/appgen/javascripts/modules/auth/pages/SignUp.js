import React from 'react'
import { connect } from 'react-redux'
import Helmet from "react-helmet"
import SignUpForm from '../forms/SignUpForm'
import { signUp } from '../api'
import { notification } from '../../core/ducks/notifications'
import PaperCard from '../../../components/PaperCard'
import SuperNarrowedLayout from '../../../components/SuperNarrowedLayout'
import requireSignedOut from '../containers/requireSignedOut'
import * as routes from '../routes'

const SignUp = ({ dispatch }) => {

  const onSubmit = async values => {
    try {
      await signUp(values);
      dispatch(notification("You've been successfully registered!"));
      dispatch(routes.signIn());
    } catch (e) {
      const {message, data} = e;
      dispatch(notification(message));
      if (data) {
        throw data; // Errors for the form
      }
    }
  };

  return (
    <SuperNarrowedLayout>
      <Helmet title="Sign up"  />
      <PaperCard title="Sign up" subtitle="Fill in some basic info to get your LDVMi account">
        <SignUpForm onSubmit={onSubmit} />
      </PaperCard>
    </SuperNarrowedLayout>
  )
};

export default requireSignedOut(connect()(SignUp));
