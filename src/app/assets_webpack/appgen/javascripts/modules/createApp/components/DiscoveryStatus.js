import React, { PropTypes, Component } from 'react'
import { PureComponent } from 'react-pure-render'
import { Discovery } from '../models'
import PaperCard from '../../../components/PaperCard'
import LinearProgress from '../../../components/LinearProgress'
import Alert from '../../../components/Alert'

class DiscoveryStatus extends PureComponent {
  // Because of the animated <LinearProgress /> component, the number of re-renders should be
  // kept to minimum to increase the smoothness. Smart selectors and pure render component will
  // do the trick.

  static propTypes = {
    discovery: PropTypes.instanceOf(Discovery).isRequired
  };

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
