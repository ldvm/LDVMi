import { connect } from 'react-redux'
import React, {Component} from 'react'
import Paper from 'material-ui/lib/paper';
import SignUpForm from '../modules/auth/SignUpForm'
import { signUp } from '../modules/auth/api'

const SignUp = ({dispatch}) => {

  const onSubmit = async values => {
    try {
      const response = await signUp(values);
      console.log(response);
      return response;
    } catch (e) {
      console.log('Error!');
      console.log(e);
      throw e;
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
