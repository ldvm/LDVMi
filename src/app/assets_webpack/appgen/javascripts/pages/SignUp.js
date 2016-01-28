import { connect } from 'react-redux'
import React, {Component} from 'react'
import Paper from 'material-ui/lib/paper';
import SignUpForm from '../modules/auth/SignUpForm'
import sleep from '../misc/sleep'

const SignUp = ({dispatch}) => {

  const onSubmit = async values => {
    await sleep(1500);
    throw { name: `User name ${values.name} already exists` };
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
