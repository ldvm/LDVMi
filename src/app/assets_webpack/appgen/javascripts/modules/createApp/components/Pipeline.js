import React, { PropTypes } from 'react'
import { Pipeline as PipelineModel } from '../models'

const Pipeline = ({ pipeline }) => {
  return <div><i>{pipeline.uuid}</i></div>
};

Pipeline.propTypes = {
  pipeline: PropTypes.instanceOf(PipelineModel).isRequired
};

export default Pipeline;
