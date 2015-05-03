import React from 'react'

import Form from '../misc/forms/Form.jsx'
import InputH from '../misc/forms/InputH.jsx'

export default class SignUpForm extends Form {
    render() {
        return (
            <form className="form-horizontal" onSubmit={this.handleSubmit.bind(this)}>
                <InputH type="text" label="Your e-mail" labelWidth={4} connect={this.connect('email')}/>
                <InputH type="submit" value="Sign up" bsStyle="primary" labelWidth={4} disabled={!this.valid}/>
            </form>
        );
    }
}

SignUpForm.validationScheme = {
    properties: {
        email: {
            description: 'Your e-mail',
            type: 'string',
            required: true,
            allowEmpty: false,
            message: 'Please fill in your e-mail address'
        }
    }
};
