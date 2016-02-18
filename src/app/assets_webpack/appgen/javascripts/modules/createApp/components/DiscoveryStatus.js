import React, { PropTypes, Component } from 'react'
import { Discovery } from '../models'
import PaperCard from '../../../misc/components/PaperCard'
import LinearProgress from '../../../misc/components/LinearProgress'
import Alert from '../../../misc/components/Alert'

class DiscoveryStatus extends Component {
  static propTypes = {
    discovery: PropTypes.instanceOf(Discovery).isRequired
  };

  shouldComponentUpdate(nextProps) {
    // Because of the animated <LinearProgress /> component, the number of re-renders should be
    // kept to minimum to increase the smoothness.
    // TODO: deep compare should not be necessary since we're dealing with immutables.
    return !nextProps.discovery.equals(this.props.discovery);
  }

  render() {
    const {discovery} = this.props;
    return <PaperCard title={"Discovery of " + discovery.name}
      subtitle="Generating all possible visualizations of input data sources">
      {discovery.isFinished ?
        discovery.isSuccess ?
          <Alert success>The discovery successfully finished</Alert> :
          <Alert danger>The discovery failed. Please try again</Alert> :
        <div>
          The discovery is in progress. You may leave this page and come back later.
          <LinearProgress />
        </div>
      }
    </PaperCard>
  }
}

export default DiscoveryStatus;
