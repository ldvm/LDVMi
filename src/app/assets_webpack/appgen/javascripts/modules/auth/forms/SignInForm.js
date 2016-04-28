import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import { makeValidator, errorText } from '../../../misc/formUtils'

const SignUpForm = (props) => {
  const { fields: { email, password }, handleSubmit, submitting, disabled } = props;

  return (
    <form onSubmit={handleSubmit} className={props.className}>
      <div>
        <TextField floatingLabelText="E-mail" {...email} {...errorText(email)} fullWidth />
        <TextField floatingLabelText="Password" type="password" {...password} {...errorText(password)} fullWidth />
      </div>
      <br />
      <RaisedButton label="Sign in" onTouchTap={handleSubmit} primary fullWidth disabled={submitting || disabled} />
    </form>
  );
};

const validate = makeValidator({
  properties: {
    email: {
      allowEmpty: false,
      message: 'Please type in your e-mail address'
    },
    password: {
      allowEmpty: false,
      message: 'Please type in your password'
    }
  }
});

export default reduxForm({
  form: 'signin',
  fields: ['email', 'password'],
  validate
})(SignUpForm);
