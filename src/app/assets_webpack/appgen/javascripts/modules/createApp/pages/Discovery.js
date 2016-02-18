import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getDiscovery } from '../ducks/discovery'
import { discoverySelector } from '../selector'
import PromiseResult from '../../../misc/components/PromiseResult'
import CenteredMessage from '../../../misc/components/CenteredMessage'
import DiscoveryStatus from '../components/DiscoveryStatus'
import Pipelines from '../components/Pipelines'

class Discovery extends Component {
  componentDidMount() {
    const {dispatch, params: {userPipelineDiscoveryId}} = this.props;
    dispatch(getDiscovery(userPipelineDiscoveryId));
  }

  render() {
    const {isLoading, error, discovery, pipelines} = this.props;

    return <div>
      <PromiseResult isLoading={isLoading} error={error} />
      {discovery && <div>
        <DiscoveryStatus discovery={discovery} />
        {pipelines.size > 0 ?
          <Pipelines pipelines={pipelines} /> :
          <CenteredMessage>
            No pipelines found {discovery.isFinished ? '.' : ' (yet).'}
          </CenteredMessage>
        }
      </div>}
    </div>
  }
}

export default connect(discoverySelector)(Discovery);
