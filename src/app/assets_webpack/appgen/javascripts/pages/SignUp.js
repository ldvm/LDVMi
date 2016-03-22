import { connect } from 'react-redux'
import Helmet from "react-helmet"
import React, {Component} from 'react'
import Paper from 'material-ui/lib/paper';
import SignUpForm from '../modules/auth/SignUpForm'
import { signUp } from '../modules/auth/api'
import { notification } from '../modules/core/ducks/notifications'
import PaperCard from '../components/PaperCard'
import NarrowedLayout from '../components/NarrowedLayout'

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
    <NarrowedLayout>
      <div className="signup-container">
        <Helmet title="Sign up"  />
        <PaperCard title="Sign up" subtitle="Fill in some basic info to get your LDVMi account">
          <SignUpForm onSubmit={onSubmit} />
        </PaperCard>
      </div>
    </NarrowedLayout>
  )
};

export default connect()(SignUp);
