import React from 'react'

import Form from '../../misc/forms/Form.jsx'
import InputH from '../../misc/forms/InputH.jsx'

export default class SignUpForm extends Form {
    render() {
        return (
            <form className="form-horizontal" onSubmit={this.handleSubmit.bind(this)}>
                <InputH type="text" label="Your name" labelWidth={4}
                        connect={this.connect('name')}/>
                <InputH type="text" label="Your e-mail" labelWidth={4}
                        connect={this.connect('email')}/>
                <InputH type="password" label="Password" labelWidth={4}
                        connect={this.connect('password')}/>
                <InputH type="password" label="Confirm password" labelWidth={4}
                        connect={this.connect('passwordConfirm')}/>
                <InputH type="submit" value="Sign up" bsStyle="primary" labelWidth={4}
                        disabled={!this.valid}/>
            </form>
        );
    }
}

SignUpForm.validationScheme = {
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
            conform: (_, data) => data.password === data.passwordConfirm,
            messages: {
                minLength: 'Password is too short',
                conform: 'Passwords do not match'
            },
            message: 'Please choose a password'
        },
        passwordConfirm: {
            allowEmpty: false,
            message: 'Please confirm your password'
        }
    }
};
