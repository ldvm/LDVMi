import React, { PropTypes } from 'react'
import { List } from 'immutable'
import Visualizer from './Visualizer'
import {Grid, Row} from 'react-flexbox-grid'

const Visualizers = ({ visualizers, showPipelines }) => {
  return <Grid>
    <Row>
      {visualizers.map(visualizer =>
        <Visualizer
          key={visualizer.id}
          visualizer={visualizer}
          showPipelines={() => showPipelines(visualizer)}
        />)}
    </Row>
  </Grid>
};

Visualizers.propTypes = {
  visualizers: PropTypes.instanceOf(List).isRequired,
  showPipelines: PropTypes.func.isRequired
};

export default Visualizers;
