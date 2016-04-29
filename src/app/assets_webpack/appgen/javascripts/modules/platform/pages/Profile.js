import { connect } from 'react-redux'
import Helmet from "react-helmet"
import React, { Component } from 'react'
import { Link } from 'react-router'
import NarrowedLayout from '../../../components/NarrowedLayout'
import requireSignedIn from '../../auth/containers/requireSignedIn'

const Profile = ({ user }) =>
  <NarrowedLayout>
    <Helmet title="Your profile" titleTemplate="%s" />
    <h1>Welcome {user.name}</h1>
    <p>This is your profile! Somewhere in the near future you will see your applications here</p>
    <ul>
      <li><Link to="/create-app/select-sources">Create new application</Link></li>
    </ul>
  </NarrowedLayout>

// TODO: make a selector
export default requireSignedIn(connect(state => ({user: state.auth.user}))(Profile));
