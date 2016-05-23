import React, { Component } from 'react'
import Helmet from 'react-helmet'
import NarrowedLayout from '../../../components/NarrowedLayout'
import Headline from '../../../components/Headline'
import requireSignedIn from '../../auth/containers/requireSignedIn'

const Dashboard = () =>
  <NarrowedLayout>
    <Helmet title="Dashboard" titleTemplate="%s" />
    <Headline title="Dashboard" icon="dashboard" />
  </NarrowedLayout>;

export default requireSignedIn(Dashboard);
