import React, { PropTypes } from 'react'
import PaperCard from '../../../components/PaperCard'
import { Link } from 'react-router'
import requireSignedIn, { JUST_FORM } from '../../auth/containers/requireSignedIn'
import { User } from '../../auth/models'
import LatestUserApps from '../containers/LatestUserApps'
import * as createAppRoutes from '../../createApp/routes'
import * as dashboardRoutes from '../../dashboard/routes'
import Button from '../../../components/Button'
import ButtonContainer from '../../../components/ButtonContainer'

const Userbox = ({ user }) =>
  <PaperCard title="Overview of your profile" subtitle={'Hello ' + user.name + '!'}>
    <div>You can start by <Link to={createAppRoutes.createAppUrl()}>creating a new application</Link>.</div>
    <p><strong>Your latest applications:</strong></p>
    <LatestUserApps />
    <p>
      You can also go to the <Link to={dashboardRoutes.dashboardUrl()}>dashboard</Link> to see your
      latest <Link to={dashboardRoutes.discoveriesUrl()}>discoveries</Link>.
    </p>
    <ButtonContainer buttons={[
      <Link to={createAppRoutes.createAppUrl()}>
        <Button raised success fullWidth icon="add" label="Create application" />
      </Link>,
      <Link to={dashboardRoutes.dashboardUrl()}>
        <Button raised fullWidth icon="dashboard" label="Dashboard" />
      </Link>
      //, <Button raised fullWidth icon="exit_to_app" label="Sign out" onTouchTap={signOut} />
    ]}/>
  </PaperCard>;

Userbox.propTypes = {
  user: PropTypes.instanceOf(User).isRequired
};

export default requireSignedIn(Userbox, JUST_FORM);
