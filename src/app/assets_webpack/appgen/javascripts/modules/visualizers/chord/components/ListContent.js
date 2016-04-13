import React, { PropTypes } from 'react'
import { NodeList } from '../models'
import CenteredMessage from '../../../../components/CenteredMessage'

const ListContent = ({ list }) => {

  if (list.uris.size == 0) {
    return <CenteredMessage>
      Click the green button bellow to add items.
    </CenteredMessage>
  }

  return <div>{list.uris.size}</div>
};

ListContent.propTypes = {
  list: PropTypes.instanceOf(NodeList).isRequired
};

export default ListContent;
