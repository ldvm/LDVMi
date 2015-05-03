import React from 'react'
import Router from 'react-router'
import {Grid, Col} from 'react-bootstrap'

import Card from '../misc/material/Card.jsx'
import SignUpForm from '../forms/SignUpForm.jsx'

export default React.createClass({

    signUp: function (data) {
        console.log('Sign up:');
        console.log(data);
    },

    render: function () {
        return (
            <Grid>
                <Card title="Sign up to Payola!" subtitle="Please fill out the form">
                    <SignUpForm onSubmit={this.signUp}/>
                </Card>
            </Grid>
        )
    }
});