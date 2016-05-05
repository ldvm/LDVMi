import React, { PropTypes } from 'react'
import { OrderedSet } from 'immutable'
import LinearProgress from '../../../../components/LinearProgress'
import { PromiseStatus } from '../../../core/models'
import { NodeList } from '../models'
import loadNodes from '../containers/loadNodes'
import NodeCheckbox from './NodeCheckbox'
import Padding from '../../../../components/Padding'

const SelectedList = ({ list, graphDirected, nodes, status, select, remove, removeWithRelated, disableManaging, disableSelecting }) => (
  <div>
    {status.isLoading && <Padding space={2}><LinearProgress /></Padding>}

    {nodes.map(node =>
      <NodeCheckbox
        key={node.uri}
        node={node}
        graphDirected={graphDirected}
        selected={list.selected.includes(node.uri)}
        select={selected => select(node.uri, selected)}
        remove={() => remove(node.uri)}
        removeWithRelated={direction => removeWithRelated(node.uri, direction)}
        disableManaging={disableManaging}
        disableSelecting={disableSelecting}
      />
    )}
  </div>
);

SelectedList.propTypes = {
  list: PropTypes.instanceOf(NodeList).isRequired,
  graphDirected: PropTypes.bool.isRequired,
  nodes: PropTypes.instanceOf(OrderedSet).isRequired,
  status: PropTypes.instanceOf(PromiseStatus).isRequired,
  select: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  removeWithRelated: PropTypes.func.isRequired,
  disableManaging: PropTypes.bool,
  disableSelecting: PropTypes.bool
};

export default loadNodes(SelectedList);
