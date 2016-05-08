import React, { Component, PropTypes } from 'react'
import PaperCard from '../../../components/PaperCard'
import { Link } from 'react-router'
import requireSignedIn from '../../auth/containers/requireSignedIn'
import { User } from '../../auth/models'
import LatestUserApps from '../containers/LatestUserApps'
import * as routes from '../../createApp/routes'
import Button from '../../../components/Button'

const Userbox = ({ user }) =>
    <PaperCard title="Overview of your stuff" subtitle={'Hello ' + user.name + '!'}>
      <div>You can start by <Link to={routes.createAppUrl()}>creating a new application</Link>.</div>
      <p><strong>Your latest applications:</strong></p>
      <LatestUserApps />
      <p>Your discoveries and pipelines are coming soon!</p>
      <Link to={routes.createAppUrl()}>
        <Button raised success fullWidth icon="add_box" label="Create new application" />
      </Link>
    </PaperCard>;

Userbox.propTypes = {
  user: PropTypes.instanceOf(User).isRequired
};

export default requireSignedIn(Userbox);
