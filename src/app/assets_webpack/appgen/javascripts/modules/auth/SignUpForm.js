import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';

const SignUpForm = (props) => {
  const {fields: {name, email, password, confirmPassword}, handleSubmit} = props;

  return (
    <form onSubmit={handleSubmit} className={props.className}>
      <div>
        <TextField floatingLabelText="Your name" {...name} fullWidth />
        <TextField floatingLabelText="E-mail" {...email} fullWidth />
        <TextField floatingLabelText="Password" type="password" {...password} fullWidth />
        <TextField floatingLabelText="Confirm password" type="password" {...confirmPassword} fullWidth />
      </div>
      <br />
      <RaisedButton label="Sign up!" onTouchTap={handleSubmit} primary fullWidth />
    </form>
  );
};

export default reduxForm({
  form: 'signup',
  fields: ['name', 'email', 'password', 'confirmPassword']
})(SignUpForm);
