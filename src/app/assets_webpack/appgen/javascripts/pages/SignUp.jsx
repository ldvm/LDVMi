import React from 'react'
import Router from 'react-router'
import {Grid, Col} from 'react-bootstrap'

import connectToStores from '../libs/connectToStores.jsx'
import Card from '../misc/material/Card.jsx'
import SignUpForm from '../modules/auth/SignUpForm.jsx'
import AuthService from '../modules/auth/AuthService.jsx'
import AuthStore from '../modules/auth/AuthStore.jsx'

class SignUp extends React.Component
{
    signUp(data) {
        console.log(data);
        AuthService.signUp(data);
    }

    render() {
        return (
            <Grid>
                <Card title="Sign up to Payola!" subtitle="Please fill out the form">
                    {AuthStore.inProgress ? 'Loading...' : ''}
                    <SignUpForm onSubmit={this.signUp} disabled={AuthStore.inProgress}/>
                </Card>
            </Grid>
        )
    }
}

export default connectToStores(SignUp, [AuthStore]);