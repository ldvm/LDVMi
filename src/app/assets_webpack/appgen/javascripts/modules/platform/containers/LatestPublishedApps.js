import React, { Component, PropTypes } from 'react'
import { List } from 'immutable'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { getLatestPublishedApps, getLatestPublishedAppsReset, latestPublishedAppsSelector, latestPublishedAppsStatusSelector } from '../ducks/latestPublishedApps'
import PromiseResult from '../../core/components/PromiseResult'
import { PromiseStatus } from '../../core/models'
import CenteredMessage from '../../../components/CenteredMessage'
import { applicationUrl } from '../../app/applicationRoutes'

class LatestPublishedApps extends Component {
  static propTypes = {
    latestPublishedApps: PropTypes.instanceOf(List).isRequired,
    status: PropTypes.instanceOf(PromiseStatus).isRequired
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(getLatestPublishedApps());
  }
  
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(getLatestPublishedAppsReset());
  }

  render() {
    const { status, latestPublishedApps } = this.props;

    if (!status.done) {
      return <PromiseResult status={status} />
    }

    if (latestPublishedApps.size == 0)
      return <CenteredMessage>No published apps found</CenteredMessage>

    return <ul>
      {latestPublishedApps.map(app => 
        <li key={app.id}>
          <a href={applicationUrl(app)} target="_blank">{app.name}</a>
        </li>)}
    </ul>
  }
}

const selector = createStructuredSelector({
  latestPublishedApps: latestPublishedAppsSelector,
  status: latestPublishedAppsStatusSelector
});

export default connect(selector)(LatestPublishedApps);
