import React, { PropTypes } from 'react'
import { List } from 'immutable'
import PaperCard from '../../../misc/components/PaperCard'
import Pipeline from './Pipeline'

const Pipelines = ({ pipelines }) => {
  return <PaperCard title={"Discovered pipelines (" + pipelines.size + ")"}>
    {pipelines.map(pipeline =>
      <Pipeline pipeline={pipeline} key={pipeline.id} />)}
  </PaperCard>
};

Pipelines.propTypes = {
  pipelines: PropTypes.instanceOf(List).isRequired
};

export default Pipelines;
