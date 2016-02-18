import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getDiscovery } from '../ducks/discovery'

class Discovery extends Component {
  componentDidMount() {
    const {dispatch, params: {userPipelineDiscoveryId}} = this.props;
    dispatch(getDiscovery(userPipelineDiscoveryId));
  }

  render() {
    const {params: {userPipelineDiscoveryId}} = this.props;
    return <div>{userPipelineDiscoveryId}</div>
  }
}

export default connect()(Discovery);
