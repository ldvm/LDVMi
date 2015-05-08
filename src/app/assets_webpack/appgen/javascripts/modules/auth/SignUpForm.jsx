import React from 'react'

import Form from '../../misc/forms/Form.jsx'
import InputH from '../../misc/forms/InputH.jsx'

export default class SignUpForm extends Form {
    render() {
        const connect = this.connect.bind(this);

        return (
            <form onSubmit={this.handleSubmit.bind(this)} className="form-horizontal">
                <InputH type="text" label="Your name" labelWidth={4} {...connect('name')} />
                <InputH type="text" label="Your e-mail" labelWidth={4} {...connect('email')} />
                <InputH type="password" label="Password" labelWidth={4} {...connect('password')} />
                <InputH type="password" label="Confirm password" labelWidth={4} {...connect('passwordConfirm')} />
                <InputH type="submit" value="Sign up" bsStyle="primary" labelWidth={4} disabled={this.props.disabled} />
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
            messages: {
                minLength: 'Password is too short',
            },
            message: 'Please choose a password'
        },
        passwordConfirm: {
            allowEmpty: false,
            conform: (_, data) => data.password === data.passwordConfirm,
            messages: {
                conform: 'Passwords do not match'
            },
            message: 'Please confirm your password'
        }
    }
};
