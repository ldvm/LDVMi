import { connect } from 'react-redux'
import React, {Component} from 'react'
import { Link } from 'react-router'

const Home = ({user}) =>
  <div>
    <h1>Welcome to LDVMi generator</h1>
    <ul>
      <li><Link to="/signup">Sign up!</Link></li>
      <li><Link to="/create-app/select-sources">Create new application</Link></li>
    </ul>
    {user ? ' Signed in ' + user.name : 'No user signed in'}
  </div>

export default connect(state => ({user: state.auth.user}))(Home);
