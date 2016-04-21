import React, { PropTypes } from 'react'
import { NodeList } from '../models'
import CenteredMessage from '../../../../components/CenteredMessage'
import loadNodes from '../containers/loadNodes'
import PromiseResult from '../../../core/components/PromiseResult'
import Label from '../../../core/containers/Label'

const Nodes = loadNodes(({ nodes, status }) => (
  <div>
    <PromiseResult status={status} />
    {nodes.map(node =>
      <div>
        <Label label={node.label} uri={node.uri} />
      </div>
    )}
  </div>
));

const ListContent = ({ list }) => {

  if (list.uris.size == 0) {
    return <CenteredMessage>
      Click the green button bellow to add items.
    </CenteredMessage>
  }

  return <Nodes nodeUris={list.uris} />
};

ListContent.propTypes = {
  list: PropTypes.instanceOf(NodeList).isRequired
};

export default ListContent;
