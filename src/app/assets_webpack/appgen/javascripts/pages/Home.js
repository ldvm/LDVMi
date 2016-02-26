import { connect } from 'react-redux'
import Helmet from "react-helmet"
import React, {Component} from 'react'
import { Link } from 'react-router'
import NarrowedLayout from '../misc/components/NarrowedLayout'

const Home = ({user}) =>
  <NarrowedLayout>
    <Helmet title="LDVMi Application Generator" titleTemplate="%s" />
    <h1>Welcome to LDVMi generator</h1>
    <ul>
      <li><Link to="/signup">Sign up!</Link></li>
      <li><Link to="/create-app/select-sources">Create new application</Link></li>
    </ul>
    {user ? ' Signed in ' + user.name : 'No user signed in'}
  </NarrowedLayout>

export default connect(state => ({user: state.auth.user}))(Home);