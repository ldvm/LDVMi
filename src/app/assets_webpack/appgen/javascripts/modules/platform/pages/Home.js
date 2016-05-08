import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import React, { Component } from 'react'
import { Link } from 'react-router'
import { signUpUrl } from '../../auth/routes'
import NarrowedLayout from '../../../components/NarrowedLayout'
import Headline from '../../../components/Headline'

const Home = ({ user }) =>
  <NarrowedLayout>
    <Helmet title="LDVMi Application Generator" titleTemplate="%s" />
    <Headline title="Welcome to LDVMi Application Generator" icon="explore" />
    <ul>
      <li><Link to={signUpUrl()}>Sign up!</Link></li>
      <li><Link to="/create-app/select-sources">Create new application</Link></li>
    </ul>
    {user ? ' Signed in ' + user.name : 'No user signed in'}
  </NarrowedLayout>;

// TODO: make a selector
export default connect(state => ({user: state.auth.user}))(Home);
