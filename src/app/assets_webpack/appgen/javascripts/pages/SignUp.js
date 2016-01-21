import React, {Component} from 'react'
import Paper from 'material-ui/lib/paper';
import SignUpForm from '../modules/auth/SignUpForm'

export default class SignUp extends Component {
  render() {
    return (
      <div className="signup-container">
        <h1>Sign up to LDVMi</h1>
        <Paper>
          <SignUpForm onSubmit={(form) => console.log(form)} className="signup-form" />
        </Paper>
      </div>
    )
  }
}

