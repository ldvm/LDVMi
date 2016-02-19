import React, { PropTypes } from 'react'
import { List } from 'immutable'
import PaperCard from '../../../misc/components/PaperCard'
import Visualizer from './Visualizer'
import {Grid, Row} from 'react-flexbox-grid'

const Visualizers = ({ visualizers, dialogOpen, dialogClose }) => {
  return <Grid>
    <Row>
      {visualizers.map(visualizer =>
        <Visualizer
          visualizer={visualizer}
          key={visualizer.id}
          dialogOpen={dialogOpen}
          dialogClose={dialogClose}
        />)}
    </Row>
  </Grid>
};

Visualizers.propTypes = {
  visualizers: PropTypes.instanceOf(List).isRequired,
  dialogOpen: PropTypes.func.isRequired,
  dialogClose: PropTypes.func.isRequired
};

export default Visualizers;
