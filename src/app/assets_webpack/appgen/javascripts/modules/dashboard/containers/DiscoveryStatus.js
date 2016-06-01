import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import ProgressIndicator, { IN_PROGRESS, ERROR, SUCCESS } from '../../../components/ProgressIndicator'
import { Discovery } from '../../createApp/models'
import { getDiscovery } from '../ducks/discoveries'

class DiscoveryStatus extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    discovery: PropTypes.instanceOf(Discovery).isRequired
  };
  
  componentDidMount() {
    this.startPollDiscovery(this.props);
  }

  componentWillUnmount() {
    clearTimeout(this.discoveryTimeout);
  }

  componentWillReceiveProps(nextProps) {
    clearTimeout(this.discoveryTimeout);
    this.startPollDiscovery(nextProps);
  }

  startPollDiscovery(props) {
    if (!props.discovery.isFinished) {
      this.discoveryTimeout = setTimeout(() => this.getDiscovery(), 1000);
    }
  }

  getDiscovery() {
    const { dispatch, discovery: { id }} = this.props;
    dispatch(getDiscovery(id));
  }

  render() {
    const { isFinished, isSuccess } = this.props.discovery;
    const status = isFinished ? (isSuccess ? SUCCESS : ERROR) : IN_PROGRESS;

    return <ProgressIndicator status={status} />;
  }
}

export default connect()(DiscoveryStatus);
