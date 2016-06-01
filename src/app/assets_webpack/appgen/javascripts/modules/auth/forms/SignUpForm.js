import React, { Component } from 'react'
import {reduxForm} from 'redux-form'
import TextField from 'material-ui/TextField'
import Button from '../../../components/Button'
import { makeValidator, errorText } from '../../../misc/formUtils'

const SignUpForm = (props) => {
  const {fields: {name, email, password, confirmPassword}, handleSubmit, submitting} = props;

  return (
    <form onSubmit={handleSubmit} className={props.className}>
      <div>
        <TextField floatingLabelText="Your name" {...name} {...errorText(name)} fullWidth />
        <TextField floatingLabelText="E-mail" {...email} {...errorText(email)} fullWidth />
        <TextField floatingLabelText="Password" type="password" {...password} {...errorText(password)} fullWidth />
        <TextField floatingLabelText="Confirm password" type="password" {...confirmPassword} {...errorText(confirmPassword)} fullWidth />
      </div>
      <br />
      <Button label="Sign up" onTouchTap={handleSubmit} raised primary fullWidth disabled={submitting} />
    </form>
  );
};

const validate = makeValidator({
  properties: {
    name: {
      allowEmpty: false,
      message: 'Please fill in your name'
    },
    email: {
      allowEmpty: false,
      message: 'Please fill in your e-mail address'
    },
    password: {
      allowEmpty: false,
      minLength: 6,
      messages: {
        minLength: 'Password is too short',
      },
      message: 'Please choose a password'
    },
    confirmPassword: {
      allowEmpty: false,
      conform: (_, data) => data.password === data.confirmPassword,
      messages: {
        conform: 'Passwords do not match'
      },
      message: 'Please confirm your password'
    }
  }
});

export default reduxForm({
  form: 'signup',
  fields: ['name', 'email', 'password', 'confirmPassword'],
  validate
})(SignUpForm);
