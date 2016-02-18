import React, { PropTypes } from 'react'
import { Discovery } from '../models'
import PaperCard from '../../../misc/components/PaperCard'
import LinearProgress from '../../../misc/components/LinearProgress'
import Alert from '../../../misc/components/Alert'

const DiscoveryStatus = ({ discovery }) => {
  return <PaperCard title={"Discovery of " + discovery.name} subtitle="Generating all possible visualizations of input data sources">
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
};

DiscoveryStatus.propTypes = {
  discovery: PropTypes.instanceOf(Discovery).isRequired
};

export default DiscoveryStatus;
