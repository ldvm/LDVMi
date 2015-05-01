import React from '../../../../../node_modules/react/addons'
import Router from 'react-router'
import {Grid, Col} from 'react-bootstrap'

import FormValidationMixin from '../misc/forms/FormValidationMixin.jsx'
import InputH from '../misc/forms/InputH.jsx'

export default React.createClass({
    mixins: [React.addons.LinkedStateMixin, FormValidationMixin],

    getInitialState: function () {
        return {
            email: ''
        };
    },

    getValidationScheme: function () {
        return {
            properties: {
                title: {
                    description: 'Post title',
                    type: 'string',
                    required: true,
                    allowEmpty: false,
                    message: 'Please fill in the title'
                }
            }
        };
    },

    render: function () {
        return (
            <Grid>
                <h1>Sign up to Payola!</h1>
                <Col xs={6}>
                    <form className="form-horizontal">
                        <InputH type="text" label="Your e-mail" labelWidth={4} connect={this.connect('email')}/>
                    </form>
                </Col>
            </Grid>
        )
    }
});