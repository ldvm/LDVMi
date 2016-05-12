import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { List } from 'immutable'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { getLatestUserApps, getLatestUserAppsReset, latestUserAppsSelector, latestUserAppsStatusSelector } from '../ducks/latestUserApps'
import PromiseResult from '../../core/components/PromiseResult'
import { PromiseStatus } from '../../core/models'
import CenteredMessage from '../../../components/CenteredMessage'
import { applicationUrl } from '../../app/configuratorRoutes'

class LatestUserApps extends Component {
  static propTypes = {
    latestUserApps: PropTypes.instanceOf(List).isRequired,
    status: PropTypes.instanceOf(PromiseStatus).isRequired
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(getLatestUserApps());
  }
  
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(getLatestUserAppsReset());
  }

  render() {
    const { status, latestUserApps } = this.props;

    if (!status.done) {
      return <PromiseResult status={status} />
    }

    if (latestUserApps.size == 0)
      return <CenteredMessage>No published apps found</CenteredMessage>

    return <ul>
      {latestUserApps.map(app => 
        <li key={app.id}>
          <Link to={applicationUrl(app.id)}>{app.name}</Link>
        </li>)}
    </ul>
  }
}

const selector = createStructuredSelector({
  latestUserApps: latestUserAppsSelector,
  status: latestUserAppsStatusSelector
});

export default connect(selector)(LatestUserApps);
