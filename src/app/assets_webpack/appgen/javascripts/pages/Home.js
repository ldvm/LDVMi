import { connect } from 'react-redux'
import React, {Component} from 'react'
import { Link } from 'react-router'

const Home = ({user}) =>
  <div>
    <h1>Welcome to LDVMi generator</h1>
    <Link to="/signup">Sign up!</Link>
    {user ? 'Signed in ' + user.name : 'No user signed in'}
  </div>

export default connect(state => ({user: state.auth.user}))(Home);
