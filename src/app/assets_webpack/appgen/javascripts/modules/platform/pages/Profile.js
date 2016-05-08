import { connect } from 'react-redux'
import Helmet from "react-helmet"
import React, { Component } from 'react'
import { Grid,  Row, Col } from 'react-flexbox-grid'
import NarrowedLayout from '../../../components/NarrowedLayout'
import Headline from '../../../components/Headline'
import requireSignedIn from '../../auth/containers/requireSignedIn'
import Userbox from '../components/Userbox'

const Profile = ({ user }) =>
  <NarrowedLayout>
    <Helmet title="Your profile" titleTemplate="%s" />
    <Headline title="Your profile" icon="person" />
    <p>Welcome {user.name}</p>
    <p>This is your profile! Somewhere in the near future you will see all your stuff here</p>
    <Grid>
      <Row>
        <Col md={6}>
          <Userbox />
        </Col>
      </Row>
    </Grid>
  </NarrowedLayout>

// TODO: make a selector
export default requireSignedIn(connect(state => ({user: state.auth.user}))(Profile));
