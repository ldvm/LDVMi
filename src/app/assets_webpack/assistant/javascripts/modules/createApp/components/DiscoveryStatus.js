import React, { PropTypes, Component } from 'react'
import { Discovery } from '../models'
import PaperCard from '../../../components/PaperCard'
import LinearProgress from '../../../components/LinearProgress'
import Alert from '../../../components/Alert'
import makePureRender from '../../../misc/makePureRender'

// Because of the animated <LinearProgress /> component, the number of re-renders should be
// kept to minimum to increase the smoothness. Smart selectors and pure render component will
// do the trick.

const DiscoveryStatus = ({ discovery, unsupportedPipelinesCount }) => (
  <PaperCard
    title={"Discovery of " + discovery.name}
    subtitle="Generating all possible visualizations of input data sources"
  >
    {discovery.isFinished ?
      discovery.isSuccess ?
        <Alert success>
          The discovery has successfully finished
          with <strong>{discovery.pipelinesDiscoveredCount - unsupportedPipelinesCount}</strong> pipeline(s) discovered
          {unsupportedPipelinesCount > 0 ?
            <span> (plus {unsupportedPipelinesCount} unsupported)</span> : <span />}.
        </Alert> :
        <Alert danger>The discovery failed. Please try again</Alert> :
      <div>
        The discovery is in progress. You may leave this page and come back later.
        <LinearProgress />
      </div>
    }
  </PaperCard>
);

DiscoveryStatus.propTypes = {
  discovery: PropTypes.instanceOf(Discovery).isRequired,
  unsupportedPipelinesCount: PropTypes.number.isRequired
};

export default makePureRender(DiscoveryStatus);
