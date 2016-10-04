import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { List } from 'immutable'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { getLatestPublishedApps, getLatestPublishedAppsReset, latestPublishedAppsSelector, latestPublishedAppsStatusSelector } from '../ducks/latestPublishedApps'
import PromiseResult from '../../core/components/PromiseResult'
import { PromiseStatus } from '../../core/models'
import CenteredMessage from '../../../components/CenteredMessage'
import CenteredText from '../../../components/CenteredText'
import Button from '../../../components/Button'
import { visualizersSelector, visualizersStatusSelector } from '../../core/ducks/visualizers'
import { createAggregatedPromiseStatusSelector } from '../../core/ducks/promises'
import PublishedAppsGrid from '../components/PublishedAppsGrid'
import * as routes from '../routes'

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
    const { status, latestPublishedApps, visualizers } = this.props;

    if (!status.done) {
      return <PromiseResult status={status} />
    }

    if (latestPublishedApps.size == 0)
      return <CenteredMessage>No published apps found</CenteredMessage>;

    return (
      <div>
        <PublishedAppsGrid
          applications={latestPublishedApps}
          visualizers={visualizers}
        />
        <CenteredText>
          <Link to={routes.catalogUrl()}>
            <Button label="Get more in the catalog >" raised primary />
          </Link>
        </CenteredText>
      </div>
    );
  }
}

const selector = createStructuredSelector({
  latestPublishedApps: latestPublishedAppsSelector,
  visualizers: visualizersSelector,
  status: createAggregatedPromiseStatusSelector([
    latestPublishedAppsStatusSelector,
    visualizersStatusSelector
  ])
});

export default connect(selector)(LatestPublishedApps);
